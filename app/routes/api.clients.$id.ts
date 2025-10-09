// app/routes/api/clients.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import dayjs from "dayjs";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";
import { ClientStatus, getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

export const loader: LoaderFunction = async ({ params, request }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  const url = new URL(request.url);
  const showTeam = url.searchParams.get("show_team");
  const fieldsParam = url.searchParams.get("fields");

  // Campos por defecto
  const defaultSelect = {
    id: true,
    company: true,
    timezone: true,
    billing_type: true,
    currentStatus: true,
    contacts: true,
    createdAt: true,
    updatedAt: true,
  };

  // Construimos select dinámico según fields
  const select = buildDynamicSelect(fieldsParam, defaultSelect);

  try {
    let client;

    if (showTeam) {
      client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          ...select, // tus campos dinámicos
          team_members: {
            select: {
              id: true, // solo el id del team_member
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Solo select dinámico
      client = await prisma.client.findUnique({
        where: { id: clientId },
        select,
      });
    }

    if (!client) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(client, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};


export const action: ActionFunction = async ({ params, request }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  const method = request.method;

  try {
    // ----------------- DELETE -----------------
    if (method === "DELETE") {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          company: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!client) {
        return json({ error: "Client not found" }, { status: 404 });
      }

      // Transacción para borrar todo lo relacionado
      await prisma.$transaction(async (tx) => {
        await tx.retainer.deleteMany({ where: { client_id: clientId } });
        await tx.contact.deleteMany({ where: { client_id: clientId } });
        await tx.workEntry.deleteMany({ where: { client_id: clientId } });
        await tx.teamMember.deleteMany({ where: { client_id: clientId } });
        await tx.clientRates.deleteMany({ where: { clientId } });
        await tx.clientStatusHistory.deleteMany({ where: { clientId } });
        await tx.scheduleEntry.deleteMany({ where: { client_id: clientId } });
        await tx.client.delete({ where: { id: clientId } });
      
        // 📊 Ajustar AdminStats si existe
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
      
        const adminStats = await tx.adminStats.findFirst({
          where: { month, year },
        });
      
        if (adminStats && (adminStats.total_clients ?? 0) > 0) {
          await tx.adminStats.update({
            where: { id: adminStats.id },
            data: {
              total_clients: adminStats.total_clients - 1,
            },
          });
        }
      });

      return json({ deleted: client }, { status: 200 });
    }

    // ----------------- PUT -----------------
    if (method === "PUT") {
      const formData = await request.formData();
      const clientJson = formData.get("client") as string;

      if (!clientJson) {
        return json({ error: "No client data provided" }, { status: 400 });
      }

      const updatedFields = JSON.parse(clientJson);

      // Obtenemos el cliente actual para comparar
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
        select: { currentStatus: true, account_manager_id: true },
      });

      if (!existingClient) {
        return json({ error: "Client not found" }, { status: 404 });
      }

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          company: updatedFields.company,
          timezone: updatedFields.timezone as any,
          account_manager_id: updatedFields.account_manager_id,
          currentStatus: updatedFields.currentStatus,
          billing_type: updatedFields.billing_type || "HOURLY",
        },
        select: {
          id: true,
          company: true,
          timezone: true,
          billing_type: true,
          account_manager: true,
          account_manager_id: true,
          currentStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // ----------------- Historial de status -----------------
      if (
        updatedFields.currentStatus &&
        updatedFields.currentStatus !== existingClient.currentStatus
      ) {
        const userId = await getUserId(request);

        await prisma.clientStatusHistory.create({
          data: {
            clientId,
            status: updatedFields.currentStatus,
            note: `Status updated from ${getClientStatusLabel(
              existingClient.currentStatus as ClientStatus
            )} to ${getClientStatusLabel(
              updatedFields.currentStatus as ClientStatus
            )}`,
            changedById: userId,
          },
        });
      }

      // ----------------- Stats de account manager -----------------
      const month = dayjs().month() + 1;
      const year = dayjs().year();

      const previousManagerId = existingClient.account_manager_id;
      const newManagerId = updatedFields.account_manager_id;

      // 1️⃣ Decrementar contador del anterior manager si cambió
      if (previousManagerId && previousManagerId !== newManagerId) {
        const prevStats = await prisma.userStats.findFirst({
          where: { user_id: previousManagerId, month, year },
        });
        if (prevStats && (prevStats.companies_as_account_manager ?? 0) > 0) {
          await prisma.userStats.update({
            where: { id: prevStats.id },
            data: {
              companies_as_account_manager: prevStats.companies_as_account_manager - 1,
            },
          });
        }
      }

      // 2️⃣ Incrementar contador del nuevo manager o crear stats
      if (newManagerId) {
        const newStats = await prisma.userStats.findFirst({
          where: { user_id: newManagerId, month, year },
        });
        if (newStats) {
          await prisma.userStats.update({
            where: { id: newStats.id },
            data: {
              companies_as_account_manager: (newStats.companies_as_account_manager ?? 0) + 1,
            },
          });
        } else {
          await prisma.userStats.create({
            data: {
              user_id: newManagerId,
              month,
              year,
              total_work_entries: 0,
              companies_as_account_manager: 1,
              companies_as_team_member: 0,
              hours_engineering: 0.0,
              hours_architecture: 0.0,
              hours_senior_architecture: 0.0,
            },
          });
        }
      }

      return json({ updated: updatedClient }, { status: 200 });
    }

    return json({ error: "Unsupported method" }, { status: 405 });
  } catch (error) {
    console.error("Error processing client action:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
// app/routes/api/clients.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";

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

      await prisma.client.delete({
        where: { id: clientId },
      });

      return json({ deleted: client }, { status: 200 });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const clientJson = formData.get("client") as string;

      if (!clientJson) {
        return json({ error: "No client data provided" }, { status: 400 });
      }

      const updatedFields = JSON.parse(clientJson);

      // Obtenemos el estado actual para comparar antes de actualizar
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
        select: { currentStatus: true },
      });

      if (!existingClient) {
        return json({ error: "Client not found" }, { status: 404 });
      }

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          company: updatedFields.company,
          timezone: updatedFields.timezone,
          account_manager_id: updatedFields.account_manager_id,
          currentStatus: updatedFields.currentStatus,
        },
        select: {
          id: true,
          company: true,
          timezone: true,
          account_manager: true,
          currentStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Si cambió el currentStatus, creamos el historial
      if (
        updatedFields.currentStatus &&
        updatedFields.currentStatus !== existingClient.currentStatus
      ) {
        const userId = await getUserId(request);

        console.log({userId})
        await prisma.clientStatusHistory.create({
          data: {
            clientId,
            status: updatedFields.currentStatus,
            note: `Status updated from ${existingClient.currentStatus} to ${updatedFields.currentStatus}`,
            changedById: userId
          },
        });
      }

      return json({ updated: updatedClient }, { status: 200 });
    }

    return json({ error: "Unsupported method" }, { status: 405 });
  } catch (error) {
    console.error("Error processing client action:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
// app/routes/api/team-members.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { TeamMemberSchema } from "~/utils/schemas/teamMemberSchema";
import { z } from "zod";
import dayjs from "dayjs";

// GET /api/team-members/:id → obtener un team member
export const loader: LoaderFunction = async ({ params }) => {
  const teamMemberId = params.id;

  if (!teamMemberId) {
    return new Response(JSON.stringify({ error: "Missing team member ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const teamMember = await prisma.teamMember.findUnique({
    where: { id: teamMemberId },
    include: {
      client: true,
      user: true,
    },
  });

  if (!teamMember) {
    return new Response(JSON.stringify({ error: "Team member not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(teamMember), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// PUT / DELETE /api/team-members/:id
export const action: ActionFunction = async ({ params, request }) => {
  const teamMemberId = params.id;

  if (!teamMemberId) {
    return new Response(JSON.stringify({ error: "Missing team member ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    // ----------------- DELETE -----------------
    if (method === "DELETE") {
      const existing = await prisma.teamMember.findUnique({
        where: { id: teamMemberId },
        select: { id: true, client_id: true, user_id: true, role: true },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Team member not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Actualizar estadísticas antes de eliminar
      const month = dayjs().month() + 1;
      const year = dayjs().year();
      const stats = await prisma.userStats.findFirst({
        where: { user_id: existing.user_id, month, year },
      });

      if (stats && (stats.companies_as_team_member ?? 0) > 0) {
        await prisma.userStats.update({
          where: { id: stats.id },
          data: { companies_as_team_member: stats.companies_as_team_member - 1 },
        });
      }

      await prisma.teamMember.delete({ where: { id: teamMemberId } });

      return new Response(JSON.stringify({ deleted: existing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ----------------- PUT -----------------
    if (method === "PUT") {
      const formData = await request.formData();
      const updateJson = formData.get("teamMembers") as string;

      if (!updateJson) {
        return new Response(JSON.stringify({ error: "No team member data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsedTeamMembers: {
        client_id: string;
        user_id: string;
        role: string;
        rate_type: string;
      }[] = JSON.parse(updateJson);

      const month = dayjs().month() + 1;
      const year = dayjs().year();

      if (!parsedTeamMembers.length) {
        // Si el team se quedó vacío, descontar a todos los miembros existentes
        const allExisting = await prisma.teamMember.findMany({
          where: { client_id: teamMemberId },
          select: { user_id: true },
        });

        for (const member of allExisting) {
          const stats = await prisma.userStats.findFirst({
            where: { user_id: member.user_id, month, year },
          });
          if (stats && stats.companies_as_team_member > 0) {
            await prisma.userStats.update({
              where: { id: stats.id },
              data: { companies_as_team_member: stats.companies_as_team_member - 1 },
            });
          }
        }

        return new Response(JSON.stringify({ updatedTeamMembers: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Obtener miembros actuales del cliente
      const existingTeamMembers = await prisma.teamMember.findMany({
        where: { client_id: parsedTeamMembers[0].client_id },
        select: { user_id: true },
      });

      const existingUserIds = existingTeamMembers.map((m) => m.user_id);
      const newUserIds = parsedTeamMembers.map((m) => m.user_id);

      // 1️⃣ Decrementar contador de quienes se quitaron
      for (const oldUserId of existingUserIds) {
        if (!newUserIds.includes(oldUserId)) {
          const stats = await prisma.userStats.findFirst({
            where: { user_id: oldUserId, month, year },
          });
          if (stats && stats.companies_as_team_member > 0) {
            await prisma.userStats.update({
              where: { id: stats.id },
              data: { companies_as_team_member: stats.companies_as_team_member - 1 },
            });
          }
        }
      }

      // 2️⃣ Incrementar contador de quienes se agregaron
      for (const newMember of parsedTeamMembers) {
        if (!existingUserIds.includes(newMember.user_id)) {
          const stats = await prisma.userStats.findFirst({
            where: { user_id: newMember.user_id, month, year },
          });
          if (stats) {
            await prisma.userStats.update({
              where: { id: stats.id },
              data: { companies_as_team_member: (stats.companies_as_team_member ?? 0) + 1 },
            });
          } else {
            await prisma.userStats.create({
              data: {
                user_id: newMember.user_id,
                month,
                year,
                total_work_entries: 0,
                companies_as_account_manager: 0,
                companies_as_team_member: 1,
                hours_engineering: 0.0,
                hours_architecture: 0.0,
                hours_senior_architecture: 0.0,
              },
            });
          }
        }
      }

      // 3️⃣ Actualizar o crear todos los miembros
      const updatedTeamMembers: typeof parsedTeamMembers = [];
      for (const member of parsedTeamMembers) {
        const updated = await prisma.teamMember.upsert({
          where: {
            client_id_user_id: { client_id: member.client_id, user_id: member.user_id },
          },
          //@ts-ignore
          update: { role: member.role, rate_type: member.rate_type },
          create: {
            client_id: member.client_id,
            user_id: member.user_id,
            //@ts-ignore
            role: member.role,
            //@ts-ignore
            rate_type: member.rate_type,
          },
        });
        updatedTeamMembers.push(updated);
      }

      return new Response(JSON.stringify({ updatedTeamMembers }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported method" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing team member action:", error);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
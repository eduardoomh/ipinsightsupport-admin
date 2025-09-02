// app/routes/api/team-members.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { TeamMemberSchema } from "~/utils/schemas/teamMemberSchema";
import { z } from "zod";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";
import { getUserId } from "~/config/session.server";
import dayjs from "dayjs";

// GET /api/team-members

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const fieldsParam = url.searchParams.get("fields");

  const where = clientId ? { client_id: clientId } : {};

  const defaultSelect = {
    id: true,
    role: true,
    rate_type: true,
    client_id: true,
    user_id: true,
    createdAt: true,
    updatedAt: true,
  };

  const queryOptions: any = {
    where,
    orderBy: { updatedAt: "desc" },
  };

  if (clientId) {
    // Si hay client_id → solo los campos solicitados o por defecto, sin include
    queryOptions.select = buildDynamicSelect(fieldsParam, defaultSelect);
  } else {
    // Si NO hay client_id → devuelve todo y permite incluir client y user
    queryOptions.select = buildDynamicSelect(fieldsParam, {
      ...defaultSelect,
      client: true,
      user: true,
    });
    queryOptions.include = {
      client: true,
      user: true,
    };
  }

  const teamMembers = await prisma.teamMember.findMany(queryOptions);

  return new Response(JSON.stringify(teamMembers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/team-members → agregar o actualizar un miembro del equipo

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const teamJson = formData.get("teamMember") as string;

  if (!teamJson) {
    return new Response(
      JSON.stringify({ error: "No team member data provided" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const parsed = TeamMemberSchema.parse(JSON.parse(teamJson));

    // Guardar o actualizar TeamMember
    const savedMember = await prisma.teamMember.upsert({
      where: {
        client_id_user_id: {
          client_id: parsed.client_id,
          user_id: parsed.user_id,
        },
      },
      update: {
        role: parsed.role,
        rate_type: parsed.rate_type,
      },
      create: {
        client_id: parsed.client_id,
        user_id: parsed.user_id,
        role: parsed.role,
        rate_type: parsed.rate_type,
      },
    });

    // Obtener mes y año actual
    const month = dayjs().month() + 1; // mes actual (1-12)
    const year = dayjs().year();

    // Buscar stats existentes para ese user_id + mes + año
    const existingStats = await prisma.userStats.findFirst({
      where: { user_id: parsed.user_id, month, year },
    });

    if (existingStats) {
      // Actualizar solo el campo companies_as_team_member
      await prisma.userStats.update({
        where: { id: existingStats.id },
        data: {
          companies_as_team_member:
            (existingStats.companies_as_team_member ?? 0) + 1,
        },
      });
    } else {
      // Crear nuevo registro con companies_as_team_member = 1
      await prisma.userStats.create({
        data: {
          user_id: parsed.user_id,
          month,
          year,
          companies_as_team_member: 1,
          total_work_entries: 0,
          companies_as_account_manager: 0,
          hours_engineering: 0.0,
          hours_architecture: 0.0,
          hours_senior_architecture: 0.0,
        },
      });
    }

    return new Response(JSON.stringify(savedMember), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving team member:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof z.ZodError
            ? error.flatten()
            : "Error saving team member",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
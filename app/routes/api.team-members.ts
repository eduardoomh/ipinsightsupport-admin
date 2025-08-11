// app/routes/api/team-members.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { TeamMemberSchema } from "~/utils/schemas/teamMemberSchema";
import { z } from "zod";

// GET /api/team-members

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");

  const where = clientId ? { client_id: clientId } : {};

  const teamMembers = await prisma.teamMember.findMany({
    where,
    include: {
      client: true,
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });

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
    return new Response(JSON.stringify({ error: "No team member data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = TeamMemberSchema.parse(JSON.parse(teamJson));

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

    return new Response(JSON.stringify(savedMember), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving team member:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof z.ZodError ? error.flatten() : "Error saving team member",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
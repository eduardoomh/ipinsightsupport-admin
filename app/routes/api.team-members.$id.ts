// app/routes/api/team-members.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { TeamMemberSchema } from "~/utils/schemas/teamMemberSchema";
import { z } from "zod";

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
    if (method === "DELETE") {
      const existing = await prisma.teamMember.findUnique({
        where: { id: teamMemberId },
        select: {
          id: true,
          client_id: true,
          user_id: true,
          role: true,
        },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Team member not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.teamMember.delete({
        where: { id: teamMemberId },
      });

      return new Response(JSON.stringify({ deleted: existing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const updateJson = formData.get("teamMember") as string;

      if (!updateJson) {
        return new Response(JSON.stringify({ error: "No team member data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = TeamMemberSchema.parse(JSON.parse(updateJson));

      const updated = await prisma.teamMember.update({
        where: { id: teamMemberId },
        data: {
          role: parsed.role,
          rate_type: parsed.rate_type,
        },
        select: {
          id: true,
          client_id: true,
          user_id: true,
          role: true,
          rate_type: true,
          updatedAt: true,
        },
      });

      return new Response(JSON.stringify({ updated }), {
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
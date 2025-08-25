// app/routes/api/clients.$id.team-members.ts
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const teamMembers = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        team_members: {
          select: {
            id: true,
            role: true,
            rate_type: true,
            user: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!teamMembers) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(teamMembers.team_members, { status: 200 });
  } catch (error) {
    console.error("Error loading team members:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
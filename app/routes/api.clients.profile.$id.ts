import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";


export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        company: true,
        timezone: true,
        currentStatus: true,
        remainingFunds: true,
        most_recent_work_entry: true,
        most_recent_retainer_activated: true,
        estimated_engineering_hours: true,
        estimated_architecture_hours: true,
        estimated_senior_architecture_hours: true,
        createdAt: true,
        billing_type: true,
        account_manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!client) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(client, { status: 200 });
  } catch (error) {
    console.error("Error loading client profile:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
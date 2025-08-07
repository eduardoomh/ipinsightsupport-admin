// app/routes/api/clients.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ClientSchema } from "~/utils/schemas/clientSchema";
import { prisma } from "~/config/prisma.server";

// GET /api/clients → obtener todos los clientes con relaciones clave
export const loader: LoaderFunction = async () => {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contacts: true,
      work_entries: {
        orderBy: { billed_on: "desc" },
        take: 1, // solo el más reciente
      },
      client_retainers: {
        orderBy: { date_activated: "desc" },
        take: 1, // solo el más reciente
      },
      team_members: {
        include: {
          user: true,
        },
      },
      rates: true,
      client_status_history: {
        orderBy: { changedAt: "desc" },
        take: 5,
      },
    },
  });

  return new Response(JSON.stringify(clients), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/clients → crear nuevo cliente
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const clientJson = formData.get("client") as string;

  if (!clientJson) {
    return new Response(JSON.stringify({ error: "No client data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const clientParsed = JSON.parse(clientJson);
    const client = ClientSchema.parse(clientParsed); // valida el input

    const savedClient = await prisma.client.create({
      data: {
        company: client.company,
        currentStatus: client.currentStatus ?? "ADHOC",
        timezone: client.timezone ?? "CENTRAL",
        remainingFunds: client.remainingFunds ?? 0.0,
        most_recent_work_entry: client.most_recent_work_entry ?? null,
        most_recent_retainer_activated: client.most_recent_retainer_activated ?? null,
      },
    });

    return new Response(JSON.stringify(savedClient), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating client:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error && "errors" in error
            ? (error as any).errors
            : "Error creating client",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
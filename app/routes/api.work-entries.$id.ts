import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing work entry id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const workEntry = await prisma.workEntry.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, company: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!workEntry) {
      return new Response(JSON.stringify({ error: "Work entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(workEntry), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching work entry:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing work entry id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const entryData = formData.get("entry")?.toString();

    if (!entryData) {
      return new Response(JSON.stringify({ error: "No entry data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      user_id,
      client_id,
      billed_on,
      hours_billed,
      hours_spent,
      summary,
    } = JSON.parse(entryData);

    // 1️⃣ Obtener entry actual y client
    const currentEntry = await prisma.workEntry.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!currentEntry) {
      return new Response(JSON.stringify({ error: "Work entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = currentEntry.client;
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Calcular diferencia de horas y ajustar remainingFunds
    const hourDiff = hours_billed - currentEntry.hours_billed; // positivo si aumentan horas, negativo si disminuyen
    const fundAdjustment = hourDiff * currentEntry.hourly_rate;
    const newRemainingFunds = Number(client.remainingFunds) - fundAdjustment;

    // 3️⃣ Transacción para actualizar entry y cliente
    const [updatedWorkEntry, updatedClient] = await prisma.$transaction([
      prisma.workEntry.update({
        where: { id },
        data: {
          user_id,
          client_id,
          billed_on: billed_on ? new Date(billed_on) : null,
          hours_billed,
          hours_spent,
          summary,
        },
        include: {
          client: { select: { id: true, company: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.client.update({
        where: { id: client_id },
        data: {
          remainingFunds: newRemainingFunds,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({ workEntry: updatedWorkEntry, client: updatedClient }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error updating work entry:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
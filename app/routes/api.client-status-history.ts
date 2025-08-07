// app/routes/api/client-status-history.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { ClientStatusHistorySchema } from "~/utils/schemas/clientStatusHistorySchema";
import { z } from "zod";

// GET /api/client-status-history
export const loader: LoaderFunction = async () => {
  const history = await prisma.clientStatusHistory.findMany({
    orderBy: { changedAt: "desc" },
    include: {
      client: true,
      changedBy: true,
    },
  });

  return new Response(JSON.stringify(history), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/client-status-history
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const historyJson = formData.get("history") as string;

  if (!historyJson) {
    return new Response(JSON.stringify({ error: "No history data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = ClientStatusHistorySchema.parse(JSON.parse(historyJson));

    const newHistory = await prisma.clientStatusHistory.create({
      data: {
        status: parsed.status,
        note: parsed.note,
        client: { connect: { id: parsed.clientId } },
        changedBy: parsed.changedById
          ? { connect: { id: parsed.changedById } }
          : undefined,
      },
    });

    return new Response(JSON.stringify(newHistory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating client status history:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof z.ZodError ? error.flatten() : "Error creating status history",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
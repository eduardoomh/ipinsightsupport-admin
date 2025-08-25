// app/routes/api/client-status-history.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { ClientStatusHistorySchema } from "~/utils/schemas/clientStatusHistorySchema";
import { z } from "zod";
import { getUserId } from "~/config/session.server";

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

  const where = clientId ? { clientId } : undefined;

  const history = await prisma.clientStatusHistory.findMany({
    where,
    orderBy: { changedAt: "desc" },
    include: {
      client: {
        select: {
          id: true,
          company: true,
        },
      },
      changedBy: {
        select: {
          id: true,
          name: true,
        },
      },
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
    const userId = await getUserId(request);
    const data: any = {
      client: { connect: { id: parsed.clientId } },
      changedBy: userId ? { connect: { id: userId } } : undefined,
    };


    if (parsed.status) {
      data.status = parsed.status;
    }
    if (parsed.title) {
      data.title = parsed.title;
    }

    const newHistory = await prisma.clientStatusHistory.create({
      data: {
        ...data,
        note: parsed.note,
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
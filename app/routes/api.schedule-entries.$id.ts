// app/routes/api/schedule-entries.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { ScheduleEntrySchema } from "~/utils/schemas/scheduleEntrySchema";

// GET /api/schedule-entries/:id
export const loader: LoaderFunction = async ({ params }) => {
  const entryId = params.id;

  if (!entryId) {
    return new Response(JSON.stringify({ error: "Missing schedule entry ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const entry = await prisma.scheduleEntry.findUnique({
    where: { id: entryId },
    include: {
      client: true,
      user: true,
    },
  });

  if (!entry) {
    return new Response(JSON.stringify({ error: "Schedule entry not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(entry), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// PUT / DELETE /api/schedule-entries/:id
export const action: ActionFunction = async ({ params, request }) => {
  const entryId = params.id;

  if (!entryId) {
    return new Response(JSON.stringify({ error: "Missing schedule entry ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      const existing = await prisma.scheduleEntry.findUnique({
        where: { id: entryId },
        select: {
          id: true,
          date: true,
          status: true,
          user_id: true,
        },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Schedule entry not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.scheduleEntry.delete({
        where: { id: entryId },
      });

      return new Response(JSON.stringify({ deleted: existing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const entryJson = formData.get("scheduleEntry") as string;

      if (!entryJson) {
        return new Response(JSON.stringify({ error: "No schedule entry data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = ScheduleEntrySchema.parse(JSON.parse(entryJson));

      const updated = await prisma.scheduleEntry.update({
        where: { id: entryId },
        data: {
          date: new Date(parsed.date),
          status: parsed.status,
          note: parsed.note,
          client_id: parsed.client_id ?? null,
          user_id: parsed.user_id,
        },
        select: {
          id: true,
          date: true,
          status: true,
          note: true,
          user_id: true,
          client_id: true,
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
    console.error("Error processing schedule entry action:", error);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
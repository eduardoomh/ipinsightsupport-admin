import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { z } from "zod";

// Zod schema para actualizar un retainer
const RetainerUpdateSchema = z.object({
  amount: z.number(),
  date_activated: z.string().datetime(),
  note: z.string().optional(),
  is_credit: z.boolean(),
  client_id: z.string(),
  created_by_id: z.string(),
});

// GET /api/retainers/:id
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing retainer ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const retainer = await prisma.retainer.findUnique({
    where: { id },
    include: {
      client: true,
      created_by: true,
    },
  });

  if (!retainer) {
    return new Response(JSON.stringify({ error: "Retainer not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(retainer), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// PUT & DELETE /api/retainers/:id
export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing retainer ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      const existing = await prisma.retainer.findUnique({
        where: { id },
        select: {
          id: true,
          amount: true,
          date_activated: true,
          client_id: true,
        },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Retainer not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.retainer.delete({ where: { id } });

      return new Response(JSON.stringify({ deleted: existing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const retainerJson = formData.get("retainer") as string;

      if (!retainerJson) {
        return new Response(JSON.stringify({ error: "No retainer data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = RetainerUpdateSchema.parse(JSON.parse(retainerJson));

      const updated = await prisma.retainer.update({
        where: { id },
        data: {
          amount: parsed.amount,
          date_activated: new Date(parsed.date_activated),
          note: parsed.note,
          is_credit: parsed.is_credit,
          client_id: parsed.client_id,
          created_by_id: parsed.created_by_id,
        },
        select: {
          id: true,
          amount: true,
          is_credit: true,
          date_activated: true,
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
    console.error("Error handling retainer:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
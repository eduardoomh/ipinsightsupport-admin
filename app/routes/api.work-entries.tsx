import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { WorkEntrySchema } from "~/utils/schemas/workEntrySchema";
import { prisma } from "~/config/prisma.server";

// GET /api/work-entries → obtener todas las entradas de trabajo
export const loader: LoaderFunction = async () => {
  const workEntries = await prisma.workEntry.findMany({
    include: {
      client: true,
      user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return new Response(JSON.stringify(workEntries), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/work-entries → crear nueva entrada de trabajo con validación Zod
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const workEntryJson = formData.get("workEntry") as string;

  if (!workEntryJson) {
    return new Response(JSON.stringify({ error: "No work entry data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsedInput = JSON.parse(workEntryJson);

    // Validar con Zod
    const entry = WorkEntrySchema.parse(parsedInput);

    const savedEntry = await prisma.workEntry.create({
      data: {
        billed_on: new Date(entry.billed_on),
        hours_billed: entry.hours_billed,
        hours_spent: entry.hours_spent,
        hourly_rate: entry.hourly_rate,
        summary: entry.summary,
        rate_type: entry.rate_type,
        client_id: entry.client_id,
        user_id: entry.user_id,
      },
    });

    return new Response(JSON.stringify(savedEntry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error creating work entry:", error);
    return new Response(JSON.stringify({ error: "Error creating work entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
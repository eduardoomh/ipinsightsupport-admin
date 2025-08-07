import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { ScheduleEntrySchema } from "~/utils/schemas/scheduleEntrySchema";

// GET /api/schedules → obtener todos los schedules
export const loader: LoaderFunction = async () => {
  const schedules = await prisma.scheduleEntry.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      client: {
        select: { id: true, company: true },
      },
    },
  });

  return new Response(JSON.stringify(schedules), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/schedules → crear nuevo schedule con validación Zod
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const scheduleJson = formData.get("schedule") as string;

  if (!scheduleJson) {
    return new Response(JSON.stringify({ error: "No schedule data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = JSON.parse(scheduleJson);
    const schedule = ScheduleEntrySchema.parse(parsed);

    const savedSchedule = await prisma.scheduleEntry.create({
      data: {
        date: new Date(schedule.date),
        status: schedule.status,
        note: schedule.note || null,
        user: { connect: { id: schedule.user_id } },
        client: schedule.client_id ? { connect: { id: schedule.client_id } } : undefined,
      },
    });

    return new Response(JSON.stringify(savedSchedule), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error creating schedule:", error);
    return new Response(JSON.stringify({ error: "Error creating schedule" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
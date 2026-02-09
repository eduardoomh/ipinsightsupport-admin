import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import dayjs from "dayjs";

export const loader: LoaderFunction = async ({ request }) => {
  await getSessionFromCookie(request);
  
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || dayjs().format("YYYY-MM");
  // Extraemos el user_id de la URL
  const userId = url.searchParams.get("user_id");

  const startOfMonth = dayjs(month).startOf("month").toDate();
  const endOfMonth = dayjs(month).endOf("month").toDate();

  // Preparamos las condiciones base
  const whereEntries: any = { billed_on: { gte: startOfMonth, lte: endOfMonth } };
  const whereRetainers: any = { date_activated: { gte: startOfMonth, lte: endOfMonth }, is_credit: true };
  const whereSchedule: any = { date: { gte: startOfMonth, lte: endOfMonth } };
  const whereClients: any = { createdAt: { gte: startOfMonth, lte: endOfMonth } };

  // Inyectamos el filtro de usuario SOLO si existe en la URL
  if (userId && userId !== "undefined") {
    whereEntries.user_id = userId;
    whereRetainers.created_by_id = userId; // Según tu esquema es created_by_id
    whereSchedule.user_id = userId;
    whereClients.account_manager_id = userId;
  }

  const [entries, payments, schedule, companies] = await Promise.all([
    prisma.workEntry.findMany({
      where: whereEntries,
      select: { billed_on: true, hours_billed: true, client: { select: { company: true } } }
    }),
    prisma.retainer.findMany({
      where: whereRetainers,
      select: { date_activated: true, amount: true, client: { select: { company: true } } }
    }),
    prisma.scheduleEntry.findMany({
      where: whereSchedule,
      select: { date: true, status: true, client: { select: { company: true } } }
    }),
    prisma.client.findMany({
      where: whereClients,
      select: { createdAt: true, company: true }
    })
  ]);

  const calendarData: Record<string, any> = {};

  const formatKey = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const initDay = (key: string) => {
    if (!calendarData[key]) {
      calendarData[key] = { entries: [], payments: [], schedule: [], companies: [] };
    }
    return calendarData[key];
  };

  // Mapeo (Lógica intacta)
  entries.forEach(e => {
    const key = formatKey(e.billed_on);
    initDay(key).entries.push({ hours_billed: e.hours_billed, company: e.client.company });
  });

  payments.forEach(p => {
    const key = formatKey(p.date_activated);
    initDay(key).payments.push({ amount: p.amount, company: p.client.company });
  });

  schedule.forEach(s => {
    const key = formatKey(s.date);
    initDay(key).schedule.push({ status: s.status, company: s.client?.company });
  });

  // Agregamos las compañías creadas
  companies.forEach(c => {
    const key = formatKey(c.createdAt);
    initDay(key).companies.push({ company: c.company });
  });

  return json({ calendarData });
};
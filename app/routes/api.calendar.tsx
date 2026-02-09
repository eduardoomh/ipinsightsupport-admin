import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import dayjs from "dayjs";

export const loader: LoaderFunction = async ({ request }) => {
  await getSessionFromCookie(request);
  
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || dayjs().format("YYYY-MM");

  // Definimos los rangos del mes de forma absoluta
  const startOfMonth = dayjs(month).startOf("month").toDate();
  const endOfMonth = dayjs(month).endOf("month").toDate();

  const [entries, payments, schedule] = await Promise.all([
    prisma.workEntry.findMany({
      where: { billed_on: { gte: startOfMonth, lte: endOfMonth } },
      select: { billed_on: true, hours_billed: true, client: { select: { company: true } } }
    }),
    prisma.retainer.findMany({
      // BUSQUEDA DIRECTA POR DATE_ACTIVATED
      where: { 
        date_activated: { gte: startOfMonth, lte: endOfMonth }
      },
      select: { date_activated: true, amount: true, client: { select: { company: true } } }
    }),
    prisma.scheduleEntry.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
      select: { date: true, status: true, client: { select: { company: true } } }
    })
  ]);

  const calendarData: Record<string, any> = {};

  // Función interna para no repetir código y asegurar la llave YYYY-MM-DD
  const formatKey = (date: Date) => {
    // Usamos toISOString().split('T')[0] para EVITAR que la zona horaria mueva el día
    return new Date(date).toISOString().split('T')[0];
  };

  const initDay = (key: string) => {
    if (!calendarData[key]) {
      calendarData[key] = { entries: [], payments: [], schedule: [] };
    }
    return calendarData[key];
  };

  // Mapeo de Work Entries
  entries.forEach(e => {
    const key = formatKey(e.billed_on);
    initDay(key).entries.push({
      hours_billed: e.hours_billed,
      company: e.client.company
    });
  });

  // Mapeo de RETAINERS (Los que no salían)
  payments.forEach(p => {
    const key = formatKey(p.date_activated);
    initDay(key).payments.push({
      amount: p.amount,
      company: p.client.company
    });
  });

  // Mapeo de Schedule
  schedule.forEach(s => {
    const key = formatKey(s.date);
    initDay(key).schedule.push({
      status: s.status,
      company: s.client?.company
    });
  });

  return json({ calendarData });
};
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    return json({ users: [], contacts: [], clients: [], workEntries: [], retainers: [] });
  }

  try {
    // Búsqueda de Users (trabajadores)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        is_admin: true,
      },
    });

    // Búsqueda de Contacts (usuarios de clients)
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        client_id: true,
      },
    });

    // Búsqueda de Clients
    const clients = await prisma.client.findMany({
      where: {
        company: { contains: q, mode: "insensitive" },
      },
      take: 10,
      select: {
        id: true,
        company: true,
        currentStatus: true,
        timezone: true,
      },
    });

    // Búsqueda de WorkEntries (20 más recientes)
    const workEntries = await prisma.workEntry.findMany({
      where: {
        OR: [
          { summary: { contains: q, mode: "insensitive" } },
          { client: { company: { contains: q, mode: "insensitive" } } },
          { user: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 3,
      orderBy: { billed_on: "desc" },
      select: {
        id: true,
        billed_on: true,
        hours_billed: true,
        summary: true,
        client: { select: { id: true, company: true } },
        user: { select: { id: true, name: true } },
      },
    });

    // Búsqueda de Retainers (20 más recientes)
    const retainers = await prisma.retainer.findMany({
      where: {
        OR: [
          { note: { contains: q, mode: "insensitive" } },
          { client: { company: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 1,
      orderBy: { date_activated: "desc" },
      select: {
        id: true,
        amount: true,
        date_activated: true,
        is_credit: true,
        client: { select: { id: true, company: true } },
      },
    });

    return json({ users, contacts, clients, workEntries, retainers });
  } catch (err) {
    console.error("Search error:", err);
    throw new Response("Error searching", { status: 500 });
  }
}
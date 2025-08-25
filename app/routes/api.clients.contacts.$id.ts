// app/routes/api/clients.$id.contacts.ts
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const contacts = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        contacts: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!contacts) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(contacts.contacts, { status: 200 });
  } catch (error) {
    console.error("Error loading contacts:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
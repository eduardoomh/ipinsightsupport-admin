import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ClientSchema } from "~/utils/schemas/clientSchema";
import { prisma } from "~/config/prisma.server";

// GET /api/clients → obtener todos los clientes
export const loader: LoaderFunction = async () => {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return new Response(JSON.stringify(clients), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/clients → crear nuevo cliente con validación Zod
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const clientJson = formData.get("client") as string;

  if (!clientJson) {
    return new Response(JSON.stringify({ error: "No client data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const clientParsed = JSON.parse(clientJson);

    // Validar con Zod
    const client = ClientSchema.parse(clientParsed);

    const savedClient = await prisma.client.create({
      data: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
      },
    });

    return new Response(JSON.stringify(savedClient), {
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

    console.error("Error creating client:", error);
    return new Response(JSON.stringify({ error: "Error creating client" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
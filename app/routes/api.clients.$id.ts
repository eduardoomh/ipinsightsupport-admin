// app/routes/api/clients.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        company: true,
        timezone: true,
        contacts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!client) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(client, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ params, request }) => {
  const clientId = params.id;

  if (!clientId) {
    return new Response(JSON.stringify({ error: "Missing client ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          company: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!client) {
        return new Response(JSON.stringify({ error: "Client not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.client.delete({
        where: { id: clientId },
      });

      return new Response(JSON.stringify({ deleted: client }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const clientJson = formData.get("client") as string;

      if (!clientJson) {
        return new Response(JSON.stringify({ error: "No client data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updatedFields = JSON.parse(clientJson);

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          company: updatedFields.company,
          timezone: updatedFields.timezone,
        },
        select: {
          id: true,
          company: true,
          timezone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new Response(JSON.stringify({ updated: updatedClient }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported method" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing client action:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
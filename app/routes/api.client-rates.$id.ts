import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { ClientRatesSchema } from "~/utils/schemas/clientRatesSchema";

export const loader: LoaderFunction = async ({ params }) => {
  const rateId = params.id;

  if (!rateId) {
    return new Response(JSON.stringify({ error: "Missing rate ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const clientRate = await prisma.clientRates.findUnique({
    where: { id: rateId },
    include: {
      client: true,
    },
  });

  if (!clientRate) {
    return new Response(JSON.stringify({ error: "Client rates not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(clientRate), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const rateId = params.id;
  if (!rateId) {
    return new Response(JSON.stringify({ error: "Missing rate ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      const existing = await prisma.clientRates.findUnique({
        where: { id: rateId },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Client rates not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.clientRates.delete({
        where: { id: rateId },
      });

      return new Response(JSON.stringify({ deleted: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const updateJson = formData.get("clientRates") as string;

      if (!updateJson) {
        return new Response(JSON.stringify({ error: "No clientRates data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = ClientRatesSchema.parse(JSON.parse(updateJson));

      const updated = await prisma.clientRates.update({
        where: { id: rateId },
        data: {
          engineeringRate: parsed.engineeringRate,
          architectureRate: parsed.architectureRate,
          seniorArchitectureRate: parsed.seniorArchitectureRate,
        },
        select: {
          id: true,
          clientId: true,
          engineeringRate: true,
          architectureRate: true,
          seniorArchitectureRate: true,
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
    console.error("Error in client-rates action:", error);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
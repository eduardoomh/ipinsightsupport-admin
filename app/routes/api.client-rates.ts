// app/routes/api/client-rates.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { z } from "zod";
import { ClientRatesSchema } from "~/utils/schemas/clientRatesSchema";

// GET /api/client-rates
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");

  const where = clientId ? { clientId } : undefined;

  const queryOptions: any = {
    where,
    orderBy: {
      updatedAt: "desc",
    },
  };

  // Solo selecciona 3 campos si hay clientId
  if (clientId) {
    queryOptions.select = {
      engineeringRate: true,
      architectureRate: true,
      seniorArchitectureRate: true,
    };
  }else{
    queryOptions.include = {
      client: true
    }
  }

  const rates = await prisma.clientRates.findMany(queryOptions);

  return new Response(JSON.stringify(rates), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/client-rates → create or update rates for a client
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const ratesJson = formData.get("clientRates") as string;

  if (!ratesJson) {
    return new Response(JSON.stringify({ error: "No rates data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = ClientRatesSchema.parse(JSON.parse(ratesJson));

    // Upsert: update if exists, create if not
    const savedRates = await prisma.clientRates.upsert({
      where: { clientId: parsed.clientId },
      update: {
        engineeringRate: parsed.engineeringRate,
        architectureRate: parsed.architectureRate,
        seniorArchitectureRate: parsed.seniorArchitectureRate,
      },
      create: {
        clientId: parsed.clientId,
        engineeringRate: parsed.engineeringRate,
        architectureRate: parsed.architectureRate,
        seniorArchitectureRate: parsed.seniorArchitectureRate,
      },
    });

    return new Response(JSON.stringify(savedRates), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving client rates:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof z.ZodError ? error.flatten() : "Error saving client rates",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const rates = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        rates: {
          select: {
            engineeringRate: true,
            architectureRate: true,
            seniorArchitectureRate: true,
          },
        },
      },
    });

    if (!rates) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    return json(rates.rates, { status: 200 });
  } catch (error) {
    console.error("Error loading client rates:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
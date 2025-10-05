import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { WebhookEmailEvent } from "~/interfaces/webhook.interface";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = (await request.json()) as WebhookEmailEvent;
    console.log("✅ Webhook received:", body);

    await prisma.log.create({
      data: {
        source: "WEBHOOK",
        level: "INFO",
        message: `Webhook received: ${body.type}`,
        details: JSON.stringify(body),
        user_id: null,
        client_id: null,
      },
    });

    return json({ message: "Webhook received successfully", data: body }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing webhook:", error);

    await prisma.log.create({
      data: {
        source: "WEBHOOK",
        level: "ERROR",
        message: "Error processing webhook",
        details: JSON.stringify({ error: error.message }),
        user_id: null,
        client_id: null,
      },
    });

    return json({ error: "Invalid body or internal error" }, { status: 400 });
  }
};
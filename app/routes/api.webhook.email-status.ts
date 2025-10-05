import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import crypto from "crypto";
import { WebhookEmailEvent } from "~/interfaces/webhook.interface";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-signature") || "";
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("WEBHOOK_SECRET is not defined in environment variables");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signatureHeader)
    );

    if (!isValid) {
      console.error("❌ Invalid signature");
      await prisma.log.create({
        data: {
          source: "WEBHOOK",
          level: "ERROR",
          message: "Invalid signature in webhook",
          details: { receivedSignature: signatureHeader, expectedSignature },
          user_id: null,
          client_id: null,
        },
      });
      return json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as WebhookEmailEvent;
    console.log("✅ Webhook verified:", body);

    await prisma.log.create({
      data: {
        source: "WEBHOOK",
        level: "INFO",
        message: `Webhook received: ${body.type}`,
        details: JSON.stringify(body || {}),
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

export const loader = async () => {
  return json({ message: "Method not allowed" }, { status: 405 });
};
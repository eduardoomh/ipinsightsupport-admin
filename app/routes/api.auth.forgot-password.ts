// app/routes/api/forgot-password.ts
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { renderRecoverEmailHTML } from "~/utils/emails/forgot-password";

// ⚠️ Usa tu clave real de Resend desde .env
const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString() || "";

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    let account: { id: string; name: string; email: string };
    let type: "USER" | "CONTACT" = "USER";

    if (user) {
      account = { id: user.id, name: user.name, email: user.email };
    } else {
      const contact = await prisma.contact.findUnique({ where: { email } });
      if (!contact) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }
      account = { id: contact.id, name: contact.name, email: contact.email };
      type = "CONTACT";
    }

    const tokenPayload = {
      email: account.email,
      id: account.id,
      type,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "changeme", {
      expiresIn: "1d",
    });

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    const html = renderRecoverEmailHTML({
      name: account.name,
      resetUrl,
    });

    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: account.email,
      subject: "Password Recovery",
      html,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully", success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
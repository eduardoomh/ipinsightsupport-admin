// app/routes/users/$id/resend-password.tsx
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { prisma } from "~/config/prisma.server";
import { renderSetPasswordEmailHTML } from "~/utils/emails/set-password";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

export const action: ActionFunction = async ({ params }) => {
  const contactId = params.id;
  if (!contactId) {
    return json({ error: "Missing contact ID" }, { status: 400 });
  }

  try {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { id: true, name: true, email: true },
    });

    if (!contact) {
      return json({ error: "Contact not found" }, { status: 404 });
    }

    const tokenPayload = { id: contact.id, email: contact.email, type: "CONTACT" };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET ?? "changeme", {
      expiresIn: "1d",
    });

    const setPasswordUrl = `${process.env.APP_URL}/create-password?token=${token}`;
    const html = renderSetPasswordEmailHTML({ name: contact.name, setPasswordUrl });

    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: contact.email,
      subject: "Welcome! Set your password",
      html,
    });

    return json({ success: true, message: "Password setup email resent successfully." });
  } catch (error) {
    console.error("Error resending password email:", error);
    return json({ error: "Failed to resend password setup email" }, { status: 500 });
  }
};
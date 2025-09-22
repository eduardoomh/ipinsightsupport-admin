// app/routes/users/$id/resend-password.tsx
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { prisma } from "~/config/prisma.server";
import { renderSetPasswordEmailHTML } from "~/utils/emails/set-password";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

export const action: ActionFunction = async ({ params }) => {
  const userId = params.id;
  if (!userId) {
    return json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    const tokenPayload = { id: user.id, email: user.email, type: "USER" };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET ?? "changeme", {
      expiresIn: "1d",
    });

    const setPasswordUrl = `${process.env.APP_URL}/create-password?token=${token}`;
    const html = renderSetPasswordEmailHTML({ name: user.name, setPasswordUrl });

    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: user.email,
      subject: "Welcome! Set your password",
      html,
    });

    return json({ success: true, message: "Password setup email resent successfully." });
  } catch (error) {
    console.error("Error resending password email:", error);
    return json({ error: "Failed to resend password setup email" }, { status: 500 });
  }
};
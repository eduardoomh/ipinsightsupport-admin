import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import bcrypt from "bcryptjs";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const dataId = formData.get("id") as string;
  const type = formData.get("type") as string; // corregido para tomar 'type'
  const newPassword = formData.get("password") as string;

  if (!dataId || !newPassword || !type) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing id, type, or password" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (type === "USER") {
      await prisma.user.update({
        where: { id: dataId },
        data: { password: hashedPassword },
      });
    } else if (type === "CONTACT") {
      await prisma.contact.update({
        where: { id: dataId },
        data: { password: hashedPassword },
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import bcrypt from "bcryptjs";

// POST /api/auth/change-password
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const newPassword = formData.get("password") as string;

  if (!userId || !newPassword) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing userId or password" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

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
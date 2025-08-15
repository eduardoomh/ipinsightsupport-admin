// app/routes/api/auth/validate-token.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return json({ valid: false, error: "Token is required" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme");

    return json({
      valid: true,
      data: {
        email: (decoded as any).email,
        id: (decoded as any).id,
        type: (decoded as any).type
      },
    });
  } catch (err) {
    console.error("Invalid token:", err);
    return json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
  }
};
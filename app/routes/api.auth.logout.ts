// app/routes/api/auth/logout.ts
import type { ActionFunction } from "@remix-run/node";
import { destroySession, getSession } from "~/config/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);
  return new Response("Logout", {
    status: 200,
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
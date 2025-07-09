import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};
import { redirect } from "@remix-run/node";
import { getSession } from "~/config/session.server";

export const requireUserSession = async (request: Request) => {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
};
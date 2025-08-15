import { redirect } from "@remix-run/node";
import { getSession } from "~/config/session.server";

export const requireUserSession = async (request: Request) => {
  const session = await getSession(request);
  const id = session.get("id");

  if (!id) {
    throw redirect("/login");
  }

  return id;
};
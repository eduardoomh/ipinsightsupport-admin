// app/utils/session.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["tu-clave-secreta"], // cámbiala por una real y segura
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const getSession = (request: Request) => {
  return sessionStorage.getSession(request.headers.get("Cookie"));
};

export async function getUserId(request: Request) {
  const session = await getSession(request);
  return session.get("id");
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/login");
  return userId;
}

export const commitSession = sessionStorage.commitSession;
export const destroySession = sessionStorage.destroySession;
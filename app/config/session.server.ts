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

export const commitSession = sessionStorage.commitSession;
export const destroySession = sessionStorage.destroySession;
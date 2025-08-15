import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET!;
if (!sessionSecret) throw new Error("SESSION_SECRET is required");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: false, //process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    httpOnly: true,
  },
});

export const getSession = (request: Request): Promise<Session> =>
  sessionStorage.getSession(request.headers.get("Cookie"));

export const commitSession = (session: Session): Promise<string> =>
  sessionStorage.commitSession(session);

export const destroySession = (session: Session): Promise<string> =>
  sessionStorage.destroySession(session);

interface UserSessionData {
  session: Session;
  id: string | undefined;
  role: string | undefined;
  permissions: string[];
}

// Helper para obtener usuario y datos de sesión completos
export async function getUserSession(request: Request): Promise<UserSessionData> {
  const session = await getSession(request);
  const id = session.get("id") as string | undefined;
  const role = session.get("role") as string | undefined;
  const permissions = (session.get("permissions") as string[] | undefined) ?? [];

  return { session, id, role, permissions };
}

// Helper para exigir usuario (redirigir si no está autenticado)
export async function requireUser(request: Request): Promise<{ id: string; session: Session }> {
  const { id, session } = await getUserSession(request);
  if (!id) throw redirect("/login");
  return { id, session };
}

// Helper para validar permisos
export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required);
}

// Helper para validar rol (por si lo quieres usar también)
export function hasRole(userRole: string | undefined, requiredRole: string): boolean {
  return userRole === requiredRole;
}
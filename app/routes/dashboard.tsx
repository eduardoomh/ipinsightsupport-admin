import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { getSession } from "~/sessions.server";
import { Form, useLoaderData } from "@remix-run/react";

function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required);
}

interface LoaderData {
  userId: string;
  role: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const userId = session.get("userId") as string | undefined;
  const role = session.get("role") as string | undefined;
  const permissions = (session.get("permissions") as string[] | undefined) ?? [];

  if (!userId) {
    return redirect("/login");
  }

  if (!hasPermission(permissions, "view_dashboard")) {
    return redirect("/login");
  }

  return json<LoaderData>({ userId, role: role ?? "unknown" });
};

export default function Dashboard() {
  const { role } = useLoaderData<LoaderData>();

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido al dashboard!</h1>
      <p className="mb-6">Este contenido está protegido.</p>
      <p className="mb-6 font-semibold">Tu rol: {role}</p>

      <Form method="post" action="/logout">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </Form>
    </main>
  );
}
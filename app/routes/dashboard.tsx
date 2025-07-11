import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {

  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login"); // aquí sí puedes hacer redirect
  }

  const { userId, role } = session

    return json({ userId, role });
};

export default function Dashboard() {

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido al dashboard!</h1>
      <p className="mb-6">Este contenido está protegido.</p>
      <p className="mb-6 font-semibold">Tu rol: {"role"}</p>

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
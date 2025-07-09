import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { getSession, sessionStorage } from "../sessions.server";
import LoginForm from "~/components/views/LoginForm";

interface LoginFormData {
  email: string;
  password: string;
}

interface ActionData {
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session.has("userId")) {
    return redirect("/dashboard");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json<ActionData>({ error: "Datos inválidos." }, { status: 400 });
  }

  const isValidUser = email === "admin@test.com" && password === "1234";

  if (!isValidUser) {
    return json<ActionData>(
      { error: "Correo o contraseña incorrectos." },
      { status: 401 }
    );
  }

  const role = "admin";
  const permissions = ["view_dashboard", "edit_users", "manage_payroll"];

  const session = await sessionStorage.getSession();
  session.set("userId", "admin-id");
  session.set("role", role);
  session.set("permissions", permissions);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <LoginForm actionData={actionData} navigation={navigation} />
  );
}
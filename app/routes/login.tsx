// app/routes/login.tsx
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/sessions.server";
import AuthContainer from "~/components/views/auth/AuthContainer";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session.has("userId") && session.has("role")) {
    return redirect("/");
  }
  return null;
};

export default function LoginRoute() {

  return (
    <main className="flex items-center justify-center min-h-screen">
      <AuthContainer type="login" />
    </main>
  );
}
// app/routes/login.tsx
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import { getSession } from "~/sessions.server";
import AuthContainer from "~/components/views/auth/authContainer";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session.has("userId") && session.has("role")) {
    return redirect("/dashboard");
  }
  return null;
};

export default function LoginRoute() {
  const navigation = useNavigation();

  return (
    <main className="flex items-center justify-center min-h-screen">
      <AuthContainer navigation={navigation} />
    </main>
  );
}
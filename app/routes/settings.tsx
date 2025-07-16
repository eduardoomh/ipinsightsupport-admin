import { json, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import EmptyPage from "~/components/basics/EmptyPage";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {

  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login"); // aquí sí puedes hacer redirect
  }

  const { userId, role, name, email } = session

  return json({ userId, role, name, email });
};

export default function StatusReport() {
  const { name, role, email, userId } = useLoaderData<typeof loader>();
  return (
    <DashboardLayout
      title={`Settings`}
      user={{
        id: userId,
        name,
        email,
        role
      }}
    >
      <EmptyPage />
    </DashboardLayout>
  );
}
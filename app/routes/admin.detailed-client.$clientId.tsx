import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import DetailedClient from "~/components/views/clients/DetailedClient";
import { ClientI } from "~/interfaces/clients.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const clientId = params.clientId;
  if (!clientId) {
    throw new Response("Client ID is required", { status: 400 });
  }

  const res = await fetch(`${process.env.APP_URL}/api/clients/profile/${clientId}`);
  if (!res.ok) {
    throw new Response("Client not found", { status: 404 });
  }

  const client: ClientI = await res.json();

  return { client };
};

export default function AdminClientDetail() {
  const { client } = useLoaderData<typeof loader>();

  return (
    <DashboardLayout title={client.company}>
      <DetailedClient client={client} />
    </DashboardLayout>
  );
}
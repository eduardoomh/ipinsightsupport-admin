import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import DetailedClient from "~/components/views/clients/DetailedClient";
import { ClientI } from "~/interfaces/clients.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("Company ID is required", { status: 400 });
  }

  const res = await fetch(`${process.env.APP_URL}/api/clients/profile/${companyId}`);
  if (!res.ok) {
    throw new Response("Company not found", { status: 404 });
  }

  const client: ClientI = await res.json();

  return { client };
};

export default function ClientLayout() {
  const { client } = useLoaderData<typeof loader>();

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id}>
      <DetailedClient client={client} />
    </DashboardLayout>
  );
}
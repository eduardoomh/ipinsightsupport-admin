// routes/admin/advanced/retainers/$clientId.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import RetainersTable from "~/components/views/retainers/RetainersTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { ClientI } from "~/interfaces/clients.interface";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("Company ID is required", { status: 400 });
  }

  const res = await fetch(`${process.env.APP_URL}/api/clients/${companyId}`);
  if (!res.ok) {
    throw new Response("Company not found", { status: 404 });
  }

  const client: ClientI = await res.json();

  return { client };
};

export default function NewRetainersPage() {
  const { client } = useLoaderData<typeof loader>();

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id}>
      <ContentLayout title={`New retainer`} type="basic_section" size="small" hideHeader={false}>
        <p>Create</p>
      </ContentLayout>
    </DashboardLayout>
  );
}
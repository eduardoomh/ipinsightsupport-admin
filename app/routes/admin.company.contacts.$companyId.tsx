// routes/admin/advanced/contacts/$companyId.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ContactsTable from "~/components/views/contacts/ContactsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useDeleteResource } from "~/hooks/useDeleteResource";

export const loader: LoaderFunction = async ({ request, params }) => {
  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("companyId is required", { status: 400 });
  }

  return withTwoResourcesDefer({
    request,
    sessionCheck: () => getSessionFromCookie(request),
    resources: [
      { key: "client", apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,currentStatus` },
      { key: "contactsByClientData", apiPath: `${process.env.APP_URL}/api/contacts?client_id=${companyId}` },
    ],
  });
};

export default function ClientContactsPage() {
  const { client, take } = useLoaderData<typeof loader>();
  const { data: contactsData, handlePageChange } = useCursorPagination("contactsByClientData");
  const headerActions = useDashboardHeaderActions(`/admin/company/contacts/${client.id}/new`, "Create Contact");
  const refreshResults = useRefreshAndResetPagination(`/admin/company/contacts/${client.id}`);
  const deleteContact = useDeleteResource("/api/contacts", refreshResults);

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id} companyStatus={client.currentStatus}>
      <ContentLayout
        title="Contacts"
        type="basic_section"
        size="small"
        hideHeader={false}
        headerActions={headerActions}
      >
        <Suspense fallback={<SkeletonEntries />}>
          <Await resolve={contactsData}>
            {(data: any) => {
              const { contacts, pageInfo } = data;

              return (
                <>
                  <ContactsTable
                    contacts={contacts}
                    pageInfo={pageInfo}
                    onDelete={deleteContact}
                    onPageChange={handlePageChange}
                    pageSize={take}
                    viewAction={false}
                    editActionPath={`/admin/company/contacts/${client.id}/edit`}
                  />
                  <Outlet context={{ refreshResults, client }} />
                </>
              );
            }}
          </Await>
        </Suspense>
      </ContentLayout>
    </DashboardLayout>
  );
}
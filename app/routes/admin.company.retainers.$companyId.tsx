// routes/admin/advanced/retainers/$clientId.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import RetainersTable from "~/components/views/retainers/RetainersTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";

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
      { key: "retainersByClientData", apiPath: `${process.env.APP_URL}/api/retainers?client_id=${companyId}` },
    ],
  });
};

export default function ClientRetainersPage() {
  const { client, take } = useLoaderData<typeof loader>();
  const { data: retainersData, handlePageChange } = useCursorPagination("retainersByClientData");
  const headerActions = useDashboardHeaderActions(`/admin/company/retainers/${client.id}/new`, "Create Retainer");
  const refreshResults = useRefreshAndResetPagination(`/admin/company/retainers/${client.id}`);

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id } companyStatus={client.currentStatus}>
      <ContentLayout title={`Recent retainers`} type="basic_section" size="small" hideHeader={false} headerActions={headerActions}>
        <Suspense fallback={<SkeletonEntries />}>
          <Await resolve={retainersData}>
            {(data: any) => {
              const { retainers, pageInfo } = data;

              return (
                <>
                <RetainersTable
                  retainers={retainers}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                  pageSize={take}
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
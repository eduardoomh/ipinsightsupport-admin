// routes/admin/advanced/clients/index.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  Outlet
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsTable from "~/components/views/clients/ClientsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/clients`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

export default function ClientsPage() {
  const { data: clientsData, take, handlePageChange } = useCursorPagination("clientsData");
  const headerActions = useDashboardHeaderActions("/admin/advanced/clients/new", "Create Client");
  const refreshResults = useRefreshAndResetPagination("/admin/advanced/clients");
  const deleteClient = useDeleteResource("/api/clients", refreshResults);

  return (
    <DashboardLayout title="Manage clients" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={clientsData}>
          {(data: any) => {
            const { clients, pageInfo } = data;

            return (
              <>
                <ClientsTable
                  clients={clients}
                  onDelete={deleteClient}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                  pageSize={take}
                />
                <Outlet context={{ refreshResults }} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
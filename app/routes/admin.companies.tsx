// routes/admin/advanced/clients/admin.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  useLoaderData
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsAdminTable from "~/components/views/clients/ClientsAdminTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/clients?relations=team_members`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

export default function AdminClients() {
  const { data: clientsData, take, handlePageChange } = useCursorPagination("clientsData");

  return (
    <DashboardLayout title="Companies">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={clientsData}>
          {(data: any) => {
            const { clients, pageInfo } = data;

            return (
              <ClientsAdminTable
                clients={clients}
                pageInfo={pageInfo}
                onPageChange={handlePageChange}
                pageSize={take}
              />
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
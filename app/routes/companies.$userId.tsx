// routes/admin/advanced/clients/admin.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import ClientsUserTable from "~/components/views/clients/ClientsUserTable";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = params.userId;
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/clients?relations=team_members,account_manager&user_id=${userId}`,
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
              <ClientsUserTable
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
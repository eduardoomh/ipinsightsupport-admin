// routes/admin/advanced/retainers/$clientId.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  Outlet,
  useOutletContext
} from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import RetainersTable from "~/components/views/retainers/RetainersTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { ClientI } from "~/interfaces/clients.interface";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";

type ContextType = { client: ClientI };

export const loader: LoaderFunction = async ({ request, params }) => {
  const clientId = params.clientId;
  if (!clientId) {
    throw new Response("clientId is required", { status: 400 });
  }

  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/retainers?client_id=${clientId}`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "retainersByClientData",
  });
};

export default function ClientRetainersPage() {
  const { client } = useOutletContext<ContextType>();
  // Cargamos la data con el key que pusimos en el loader
  const { data: retainersData, take, handlePageChange } = useCursorPagination("retainersByClientData");
  const headerActions = useDashboardHeaderActions("/admin/detailed-client/retainers/new", "Create Retainer");

  return (
    <ContentLayout title="Retainers" type="basic_section" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={retainersData}>
          {(data: any) => {
            const { retainers, pageInfo } = data;

            if (!retainers.length) {
              return <p>There are no retainers for this client.</p>;
            }

            return (
              <RetainersTable
                retainers={retainers}
                pageInfo={pageInfo}
                onPageChange={handlePageChange}
                pageSize={take}
              />
            );
          }}
        </Await>
      </Suspense>
      <Outlet />
    </ContentLayout>
  );
}
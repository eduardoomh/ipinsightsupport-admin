// routes/admin/advanced/work-entries/$clientId.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  useOutletContext
} from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { ClientI } from "~/interfaces/clients.interface";
import AllEntriesTable from "~/components/views/entries/AllEntriesTable";
import AdminWorkEntriesTable from "~/components/views/entries/AdminWorkEntriesTable";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";

type ContextType = { client: ClientI };

export const loader: LoaderFunction = async ({ request, params }) => {
  const clientId = params.clientId;
  if (!clientId) {
    throw new Response("clientId is required", { status: 400 });
  }

  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/work-entries?client_id=${clientId}`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntriesByClientData",
  });
};

export default function ClientWorkEntriesPage() {
  const { client } = useOutletContext<ContextType>();

  // Cambiar el key para el hook según loader
  const { data: workEntriesData, take, handlePageChange } = useCursorPagination("workEntriesByClientData");
  const headerActions = useDashboardHeaderActions("/admin/detailed-client/retainers/new", "Create Work Entry");

  return (
    <ContentLayout title="Work Entries" type="basic_section" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={workEntriesData}>
          {(data: any) => {
            const { workEntries, pageInfo } = data;

            if (!workEntries.length) {
              return <p>There are no work entries for this client.</p>;
            }

            return (
              <AdminWorkEntriesTable
                entries={workEntries}
                pageInfo={pageInfo}
                onPageChange={handlePageChange}
                pageSize={take}
              />
            );
          }}
        </Await>
      </Suspense>
    </ContentLayout>
  );
}
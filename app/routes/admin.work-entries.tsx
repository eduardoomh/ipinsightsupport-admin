import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import TableFilters from "~/components/TableActions/TableFilters";
import AdminWorkEntriesTable from "~/features/WorkEntries/Tables/AdminWorkEntries/AdminWorkEntriesTable";
import WorkEntriesSkeleton from "~/features/WorkEntries/Fallbacks/WorkEntriesSkeleton";

import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { TableView } from "~/components/TableActions/TableView";
import { buildApiUrl } from "~/utils/api/buildApiUrl";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: buildApiUrl(request, "/api/work-entries", ["client_id", "user_id", "filter", "from", "to"]),
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntries",
  });
};

export const meta: MetaFunction = () => [
  { title: "Work entries | Sentinelux" },
  { name: "description", content: "Work entries page from Sentinelux Admin" },
];

export default function AdminWorkEntries() {
  const { workEntries } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("workEntries");

  const { filterValues, filterActions } = useFilters();

  const headerActions = (
    <TableFilters
      title={"Work entries"}
      path="/api/work-entries"
      fileName="work-entries"
      filterValues={filterValues}
      filterActions={filterActions}
      extraFilters={['company', 'user']}
    />
  );

  return (
    <TableView
      resolve={workEntries}
      skeleton={<WorkEntriesSkeleton />}
      headerActions={headerActions}
      baseUrl="/admin/work-entries"
    >
      {(entries, pageInfo) => (
        <AdminWorkEntriesTable
          entries={entries as any}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          pageSize={take}
          baseUrl="/admin/work-entries"
        />
      )}
    </TableView>
  );
}
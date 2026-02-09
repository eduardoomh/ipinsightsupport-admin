import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams, Outlet } from "@remix-run/react";
import { useMemo } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UserEntriesTable from "~/features/WorkEntries/Tables/UserWorkEntries/UserEntriesTable";
import TableFilters from "~/components/TableActions/TableFilters";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { TableView } from "~/components/TableActions/TableView";
import { buildApiUrl } from "~/utils/api/buildApiUrl";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;
  
  const apiPath = buildApiUrl(request, "/api/work-entries", ["client_id", "filter", "from", "to"]);
  const apiUrl = new URL(apiPath);

  apiUrl.searchParams.set("user_id", userId || "");

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntriesData",
  });
};

export const meta: MetaFunction = () => [
  { title: "My Work Entries | Sentinelux" },
];

export default function UserEntriesPage() {
  const { id: userId } = useParams();
  const { workEntriesData } = useLoaderData<typeof loader>();
  
  const { take, handlePageChange } = useCursorPagination("workEntriesData");
  const { filterValues, filterActions } = useFilters();
  const refreshResults = useRefreshAndResetPagination(`/entries/${userId}`);

  const headerActions = useMemo(() => (
    <TableFilters
      title="My work entries"
      path={`/api/work-entries?user_id=${userId}`}
      fileName={`entries_by_user`}
      filterValues={filterValues}
      filterActions={filterActions}
      disabledDownload={true}
      extraFilters={["company"]} 
    />
  ), [filterValues, filterActions, userId]);

  const handleDelete = async (entryId: string) => {
    try {
      const res = await fetch(`/api/work-entries/${entryId}`, { method: "DELETE" });
      if (res.ok) {
        refreshResults();
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
      <TableView
        resolve={workEntriesData}
        skeleton={<SkeletonEntries />}
        headerActions={headerActions}
        baseUrl={`/entries/${userId}`}
      >
        {(entries, pageInfo) => (
          <>
            <UserEntriesTable
              entries={entries as any}
              onDelete={handleDelete}
              pageInfo={pageInfo}
              onPageChange={handlePageChange}
              pageSize={take}
              baseUrl={`/entries/${userId}`}
            />
            <Outlet context={{ refreshResults }} />
          </>
        )}
      </TableView>
  );
}
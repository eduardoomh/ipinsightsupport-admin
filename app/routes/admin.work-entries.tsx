import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AdminWorkEntriesTable from "~/components/WorkEntries/Tables/AdminWorkEntries/AdminWorkEntriesTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import WorkEntriesSkeleton from "~/components/skeletons/WorkEntriesSkeleton";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/work-entries`);

  if (filter === "date" && from && to) {
    apiUrl.searchParams.set("filter", "date");
    apiUrl.searchParams.set("from", from);
    apiUrl.searchParams.set("to", to);
  } else if (filter === "recent") {
    apiUrl.searchParams.set("filter", "recent");
  }

  const clientId = url.searchParams.get("client_id");
  const userId = url.searchParams.get("user_id");

  if (clientId) apiUrl.searchParams.set("client_id", clientId);
  if (userId) apiUrl.searchParams.set("user_id", userId);

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntries",
  });
};

export const meta: MetaFunction = () => [
  { title: "Work entries | Sentinelux" },
  { name: "description", content: "Work entries page from Sentinelux Admin" },
];

export default function AdminWorkEntries() {
  const initialData = useLoaderData<typeof loader>();

  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    companyId,
    setCompanyId,
    userId,
    setUserId,
    dataPromise,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  const { data: workEntriesData, take, handlePageChange } =
    useCursorPagination("workEntries");

  const headerActions = (
    <TableFilters
      title={"Work entries"}
      path="/api/work-entries"
      fileName="work-entries"
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      enableCompanyFilter
      companyId={companyId}
      setCompanyId={setCompanyId}
      enableUserFilter
      userId={userId}
      setUserId={setUserId}
    />
  );

  return (
    <DashboardLayout title="" headerActions={headerActions}>
      <Suspense fallback={<WorkEntriesSkeleton />}>
        <Await resolve={dataPromise || initialData.workEntries}>
          {(data: any) => {
            const { workEntries, pageInfo } = data;
            return (
              <>
                <AdminWorkEntriesTable
                  entries={workEntries}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                  pageSize={take}
                  baseUrl={`/admin/work-entries`}
                />
                <Outlet
                  context={{
                    refreshResults: useRefreshAndResetPagination(
                      `/admin/work-entries`
                    ),
                  }}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
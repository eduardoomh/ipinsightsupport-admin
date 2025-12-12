import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import RetainersTable from "~/components/views/retainers/RetainersTable";
import HeaderActions from "~/components/TableActions/HeaderActions";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const isCredit = url.searchParams.get("is_credit");

  const apiUrl = new URL(`${process.env.APP_URL}/api/retainers`);

  if (filter === "date" && from && to) {
    apiUrl.searchParams.set("filter", "date");
    apiUrl.searchParams.set("from", from);
    apiUrl.searchParams.set("to", to);
  } else if (filter === "recent") {
    apiUrl.searchParams.set("filter", "recent");
  }

  if (clientId) apiUrl.searchParams.set("client_id", clientId);
  if (isCredit) apiUrl.searchParams.set("is_credit", isCredit);

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "retainersData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Balances | Sentinelux" },
  { name: "description", content: "Balances page from Sentinelux Admin" },
];

export default function AdminRetainers() {
  const initialData = useCursorPagination("retainersData");
  const { data: retainersData, take, handlePageChange } = initialData;

  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    companyId,
    setCompanyId,
    isCredit,
    setIsCredit,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  const headerActions = (
    <TableFilters
      title="Balances"
      path="/api/retainers"
      fileName="balances"
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      enableCompanyFilter
      companyId={companyId}
      setCompanyId={setCompanyId}
      isCredit={isCredit}
      setIsCredit={setIsCredit}
    />
  );

  return (
    <DashboardLayout title="" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={retainersData}>
          {(data: any) => {
            const { retainers, pageInfo } = data;

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
    </DashboardLayout>
  );
}
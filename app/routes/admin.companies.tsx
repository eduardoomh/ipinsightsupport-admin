// routes/admin/advanced/clients/admin.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsAdminTable from "~/components/views/clients/ClientsAdminTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const currentStatus = url.searchParams.get("currentStatus");
  const filter = url.searchParams.get("filter"); // recent | date
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/clients`);
  apiUrl.searchParams.set("relations", "team_members,account_manager");
  apiUrl.searchParams.set("last_note", "true");

  if (currentStatus) apiUrl.searchParams.set("currentStatus", currentStatus);

  if (filter === "date" && from && to) {
    apiUrl.searchParams.set("filter", "date");
    apiUrl.searchParams.set("from", from);
    apiUrl.searchParams.set("to", to);
  } else if (filter === "recent") {
    apiUrl.searchParams.set("filter", "recent");
  }

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Companies | Sentinelux" },
  { name: "description", content: "Companies page from Sentinelux Admin" },
];

export default function AdminClients() {
  const initialData = useLoaderData<typeof loader>();

  const { data: clientsData, take, handlePageChange } =
    useCursorPagination("clientsData");

  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    companyStatus,
    setCompanyStatus,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  // HeaderActions solo con filtros soportados: fechas y currentStatus
  const headerActions = (
    <TableFilters
      title="Companies"
      path="/api/clients"
      fileName="clients"
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      companyStatus={companyStatus}
      setCompanyStatus={setCompanyStatus}
    />
  );

  return (
    <DashboardLayout title="" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={clientsData || initialData.clientsData}>
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
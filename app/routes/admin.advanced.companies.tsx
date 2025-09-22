// routes/admin/advanced/clients/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Outlet } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsTable from "~/components/views/clients/ClientsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import { useFilters } from "~/hooks/useFilters";
import { Dayjs } from "dayjs";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import HeaderActions from "~/components/filters/HeaderActions";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/clients`);

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
  { title: "Manage Companies | Sentinelux" },
  { name: "description", content: "Manage Companies page from Sentinelux Admin" },
];

export default function ClientsPage() {
  const { data: clientsData, take, handlePageChange } = useCursorPagination("clientsData");
  const refreshResults = useRefreshAndResetPagination("/admin/advanced/companies");
  const deleteClient = useDeleteResource("/api/clients", refreshResults);

  // Hook de filtros
  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  // HeaderActions con create button
  const headerActions = (
    <HeaderActions
      title="Filter companies"
      path="/api/clients"
      fileName="clients"
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange as [Dayjs, Dayjs] | null}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      createButton={{
        label: "Create",
        path: "/admin/advanced/companies/new"
      }}
    />
  );

  return (
    <DashboardLayout title="Manage companies" headerActions={headerActions}>
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
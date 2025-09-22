// routes/admin/advanced/users/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Outlet } from "@remix-run/react";
import { Suspense } from "react";
import { Dayjs } from "dayjs";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UsersTable from "~/components/views/users/UsersTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useFilters } from "~/hooks/useFilters";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import HeaderActions from "~/components/filters/HeaderActions";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/users`);

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
    key: "usersData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Manage Users | Sentinelux" },
  { name: "description", content: "Home page from Sentinelux Admin" },
];

export default function UsersPage() {
  const { data: usersData, take, handlePageChange } = useCursorPagination("usersData");
  const refreshResults = useRefreshAndResetPagination("/admin/advanced/users");
  const deleteUser = useDeleteResource("/api/users", refreshResults);

  // Hooks para filtros
  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  // Botón de creación
  const createButton = {
    label: "Create User",
    path: "/admin/advanced/users/new",
  };

  const headerActions = (
    <HeaderActions
      title="Filter users"
      path="/api/users"
      fileName="users"
      selectedFilter={selectedFilter as "recent" | "date" | null}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange as [Dayjs, Dayjs] | null}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      createButton={createButton}
    />
  );

  return (
    <DashboardLayout title="Manage users" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={usersData}>
          {(data: any) => {
            const { users, pageInfo } = data;

            return (
              <>
                <UsersTable
                  users={users}
                  onDelete={deleteUser}
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
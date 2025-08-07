// routes/admin/advanced/users/index.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  Outlet
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UsersTable from "~/components/views/users/UsersTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useCursorPagination } from "~/hooks/useCursorPagination";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/users`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "usersData",
  });
};

export default function UsersPage() {
  const { data: usersData, take, handlePageChange } = useCursorPagination("usersData");
  const deleteUser = useDeleteResource("/api/users");
  const headerActions = useDashboardHeaderActions("/admin/advanced/users/new", "Create User");

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
                <Outlet context={{ refreshUsers: () => {} }} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
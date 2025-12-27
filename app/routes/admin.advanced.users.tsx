// routes/admin/advanced/users/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import UsersTable from "~/features/Users/Tables/UsersTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { TableView } from "~/components/TableActions/TableView";
import UsersSkeleton from "~/features/Users/Fallbacks/UsersSkeleton";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: buildApiUrl(request, "/api/users", ["filter", "from", "to"]),
    sessionCheck: () => getSessionFromCookie(request),
    key: "users",
  });
};

export const meta: MetaFunction = () => [
  { title: "Manage Users | Sentinelux" },
  { name: "description", content: "Home page from Sentinelux Admin" },
];

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("users");

  const { filterValues, filterActions } = useFilters();

  const headerActions = (
    <TableFilters
      title={"Users"}
      path="/api/users"
      fileName="users"
      filterValues={filterValues}
      filterActions={filterActions}
    />
  );

  return (
    <>
      <TableView
        resolve={users}
        skeleton={<UsersSkeleton />}
        headerActions={headerActions}
        baseUrl="/admin/advanced/users"
      >
        {(retainers, pageInfo) => (
          <UsersTable
            users={retainers as any}
            pageInfo={pageInfo}
            onPageChange={handlePageChange}
            pageSize={take}
          />
        )}
      </TableView>
    </>
  );
}
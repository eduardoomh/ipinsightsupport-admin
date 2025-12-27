// routes/admin/advanced/clients/admin.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { TableView } from "~/components/TableActions/TableView";
import CompaniesAdminTable from "~/features/Companies/Tables/AdminCompanies/CompaniesAdminTable";

export const loader: LoaderFunction = async ({ request }) => {
  const apiPath = buildApiUrl(request, "/api/clients", ["currentStatus", "filter", "from", "to"]);
  
  const apiUrl = new URL(apiPath);
  apiUrl.searchParams.set("relations", "team_members,account_manager");
  apiUrl.searchParams.set("last_note", "true");

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
  const { clientsData } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("clientsData");
  
  const { filterValues, filterActions } = useFilters();

  const headerActions = (
    <TableFilters
      title="Companies"
      path="/api/clients"
      fileName="clients"
      filterValues={filterValues}
      filterActions={filterActions}
      extraFilters={['status']} 
    />
  );

  return (
    <TableView
      resolve={clientsData}
      skeleton={<SkeletonEntries />}
      headerActions={headerActions}
      baseUrl="/admin/advanced/clients"
    >
      {(clients, pageInfo) => (
        <CompaniesAdminTable
          clients={clients as any}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          pageSize={take}
        />
      )}
    </TableView>
  );
}
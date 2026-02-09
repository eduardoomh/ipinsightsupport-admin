import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { TableView } from "~/components/TableActions/TableView";
import TableFilters from "~/components/TableActions/TableFilters";
import CompaniesByUserTable from "~/features/Companies/Tables/CompaniesByUser/CompaniesByUserTable";

export const loader: LoaderFunction = async ({ request, params }) => {
  const apiPath = buildApiUrl(request, `/api/clients/byuser`, ["currentStatus", "filter", "from", "to"]);
  
  const apiUrl = new URL(apiPath);
  if (params.userId) apiUrl.searchParams.set("user_id", params.userId);
  apiUrl.searchParams.set("relations", "team_members,account_manager");
console.log(apiUrl.toString(), "vemoooos")
  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Companies | Sentinelux" },
  { name: "description", content: "Companies page from Sentinelux" },
];

export default function AdminClients() {
  const { clientsData } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("clientsData");
  const { filterValues, filterActions } = useFilters();
 
  const headerActions = (
    <TableFilters
      title="My companies"
      path="/api/clients"
      fileName="companies_export"
      filterValues={filterValues}
      filterActions={filterActions}
      disabledDownload={true}
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
        <CompaniesByUserTable
          clients={clients as any}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          pageSize={take}
        />
      )}
    </TableView>
  );
}
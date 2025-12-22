import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { TableView } from "~/components/TableActions/TableView";
import BalancesTable from "~/features/Balances/Tables/BalancesTable";
import BalancesSkeleton from "~/features/Balances/Fallbacks/BalancesSkeleton";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: buildApiUrl(request, "/api/retainers", ["client_id", "is_credit", "filter", "from", "to"]),
    sessionCheck: () => getSessionFromCookie(request),
    key: "balances",
  });
};

export const meta: MetaFunction = () => [
  { title: "Balances | Sentinelux" },
  { name: "description", content: "Balances page from Sentinelux Admin" },
];

export default function AdminRetainers() {
  const { balances } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("balances");

  const { filterValues, filterActions } = useFilters();

  const headerActions = (
    <TableFilters
      title={"Balances"}
      path="/api/retainers"
      fileName="retainers"
      filterValues={filterValues}
      filterActions={filterActions}
      extraFilters={['credit', 'company']}
    />
  );

  return (
     <TableView
      resolve={balances}
      skeleton={<BalancesSkeleton />}
      headerActions={headerActions}
      baseUrl="/admin/balances"
    >
      {(retainers, pageInfo) => (
        <BalancesTable
          balances={retainers as any}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          pageSize={take}
        />
      )}
    </TableView>
  );
}
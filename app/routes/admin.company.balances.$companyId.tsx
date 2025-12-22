// routes/admin/advanced/retainers/$clientId.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { CompanyTableView } from "~/components/TableActions/CompanyTableView";
import BalancesTable from "~/features/Balances/Tables/BalancesTable";
import BalancesSkeleton from "~/features/Balances/Fallbacks/BalancesSkeleton";

export const loader: LoaderFunction = async ({ request, params }) => {
  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("companyId is required", { status: 400 });
  }

  const entriesPath = buildApiUrl(request, "/api/retainers", ["client_id"]);

  const entriesUrl = new URL(entriesPath);
  entriesUrl.searchParams.set("client_id", companyId);

  return withTwoResourcesDefer({
    request,
    sessionCheck: () => getSessionFromCookie(request),
    resources: [
      {
        key: "client",
        apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,currentStatus`
      },
      {
        key: "balances",
        apiPath: entriesUrl.toString()
      },
    ],
  });
};

export const meta: MetaFunction = () => [
  { title: "Company Balances | Sentinelux" },
  { name: "description", content: "Balances page from Sentinelux Admin" },
];


export default function ClientBalancesPage() {
  const { client, balances } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("balances");

  const refreshResults = useRefreshAndResetPagination(`/admin/company/balances/${client.id}`);
  const headerActions = useDashboardHeaderActions(`/admin/company/balances/${client.id}/new`, "Create Balance");

  return (
    <CompanyTableView
      title={`${client.company} | Balances`}
      company={client}
      resolve={balances}
      skeleton={<BalancesSkeleton />}
      refreshResults={refreshResults}
      headerActions={headerActions}
    >
      {(data) => (
        <BalancesTable
          balances={data.balances}
          pageInfo={data.pageInfo}
          onPageChange={handlePageChange}
          pageSize={take}
        />
      )}
    </CompanyTableView>
  );
}

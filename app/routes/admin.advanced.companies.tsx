// routes/admin/advanced/clients/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import AdvancedCompaniesTable from "~/features/Companies/Tables/AdvancedCompanies/AdvancedCompaniesTable";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { TableView } from "~/components/TableActions/TableView";
import CompanySkeleton from "~/features/Companies/Fallbacks/CompanySkeleton";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: buildApiUrl(request, "/api/clients", ["currentStatus","filter", "from", "to"]),
    sessionCheck: () => getSessionFromCookie(request),
    key: "companies",
  });
};

export const meta: MetaFunction = () => [
  { title: "Manage Companies | Sentinelux" },
  { name: "description", content: "Manage Companies page from Sentinelux Admin" },
];

export default function ClientsPage() {

  const { companies } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("companies");

  const { filterValues, filterActions } = useFilters();

  const headerActions = (
    <TableFilters
      title={"Companies"}
      path="/api/clients"
      fileName="companies"
      filterValues={filterValues}
      filterActions={filterActions}
      extraFilters={['status']}
    />
  )

  return (
    <>
      <TableView
        resolve={companies}
        skeleton={<CompanySkeleton />}
        headerActions={headerActions}
        baseUrl="/admin/advanced/companies"
      >
        {(entries, pageInfo) => (
          <AdvancedCompaniesTable
            clients={entries as any}
            pageInfo={pageInfo}
            onPageChange={handlePageChange}
            pageSize={take}
            baseUrl="/admin/advanced/companies"
          />
        )}
      </TableView>
    </>
  );
}
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { CompanyTableView } from "~/components/TableActions/CompanyTableView";
import WorkEntriesSkeleton from "~/features/WorkEntries/Fallbacks/WorkEntriesSkeleton";
import AdminWorkEntriesTable from "~/features/WorkEntries/Tables/AdminWorkEntries/AdminWorkEntriesTable";

export const loader: LoaderFunction = async ({ request, params }) => {
    const { companyId } = params;
    if (!companyId) throw new Response("companyId is required", { status: 400 });

    const entriesPath = buildApiUrl(request, "/api/work-entries", ["client_id"]);
    
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
                key: "workEntries", 
                apiPath: entriesUrl.toString() 
            }
        ],
    });
};

export const meta: MetaFunction = () => [
  { title: "Company Work entries | Sentinelux" },
  { name: "description", content: "Work entries page from Sentinelux Admin" },
];

export default function ClientEntriesPage() {
    const { client, workEntries } = useLoaderData<typeof loader>();
    const { take, handlePageChange } = useCursorPagination("workEntries");
    
    const refreshResults = useRefreshAndResetPagination(`/admin/company/work-entries/${client.id}`);
    const headerActions = useDashboardHeaderActions(`/admin/company/work-entries/${client.id}/new`, "Create Work entry");

    return (
        <CompanyTableView
            title={`${client.company} | Work entries`}
            company={client}
            resolve={workEntries}
            skeleton={<WorkEntriesSkeleton />}
            refreshResults={refreshResults}
            headerActions={headerActions}
        >
            {(data) => (
                <AdminWorkEntriesTable
                    entries={data.workEntries}
                    pageInfo={data.pageInfo}
                    onPageChange={handlePageChange}
                    pageSize={take}
                    baseUrl={`/admin/company/work-entries/${client.id}`}
                />
            )}
        </CompanyTableView>
    );
}
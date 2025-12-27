
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { UserContext } from "~/context/UserContext";
import { UserRole } from "~/interfaces/users.interface";
import { buildApiUrl } from "~/utils/api/buildApiUrl";
import { CompanyTableView } from "~/components/TableActions/CompanyTableView";
import UserEntriesTable from "~/features/WorkEntries/Tables/UserWorkEntries/UserEntriesTable";

export const loader: LoaderFunction = async ({ request, params }) => {
    const companyId = params.companyId;
    if (!companyId) {
        throw new Response("companyId is required", { status: 400 });
    }
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

export default function ClientEntriesPage() {
    const { client, workEntries } = useLoaderData<typeof loader>();
    const { take, handlePageChange } = useCursorPagination("workEntries");

    const headerActions = useDashboardHeaderActions(`/company/work-entries/${client.id}/new`, "Create Work entry");
    const refreshResults = useRefreshAndResetPagination(`/company/work-entries/${client.id}`);
    const user = useContext(UserContext)

    return (
        <CompanyTableView
            title={`${client.company} | Work entries`}
            company={client}
            resolve={workEntries}
            skeleton={<SkeletonEntries />}
            refreshResults={refreshResults}
            headerActions={headerActions}
            menuType={user.company_id ? UserRole.CLIENT : UserRole.USER}
        >
            {(data) => (
                <UserEntriesTable
                    entries={data.workEntries}
                    pageInfo={data.pageInfo}
                    onPageChange={handlePageChange}
                    pageSize={take}
                    baseUrl={`/company/work-entries/${client.id}`}
                />
            )}
        </CompanyTableView>
    );
}
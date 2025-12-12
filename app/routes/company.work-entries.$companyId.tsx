
import { LoaderFunction } from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense, useContext } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { UserContext } from "~/context/UserContext";
import UserEntriesTable from "~/components/WorkEntries/Tables/UserWorkEntries/UserEntriesTable";
import { UserRole } from "~/interfaces/users.interface";

export const loader: LoaderFunction = async ({ request, params }) => {
    const companyId = params.companyId;
    if (!companyId) {
        throw new Response("companyId is required", { status: 400 });
    }

    return withTwoResourcesDefer({
        request,
        sessionCheck: () => getSessionFromCookie(request),
        resources: [
            { key: "client", apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,currentStatus` },
            { key: "workEntriesByClientData", apiPath: `${process.env.APP_URL}/api/work-entries?client_id=${companyId}` }
        ],
    });
};

export default function ClientEntriesPage() {
    const { client, take } = useLoaderData<typeof loader>();
    const { data: workEntriesData, handlePageChange } = useCursorPagination("workEntriesByClientData");
    const headerActions = useDashboardHeaderActions(`/company/work-entries/${client.id}/new`, "Create Work entry");
    const refreshResults = useRefreshAndResetPagination(`/company/work-entries/${client.id}`);
    const user = useContext(UserContext)

    return (
        <DashboardLayout
            title={client.company}
            type="client_section"
            id={client.id}
            companyStatus={client.currentStatus}
            menuType={user.company_id ? UserRole.CLIENT : UserRole.USER}
        >
            <ContentLayout
                title={`Recent work entries`}
                type="basic_section"
                size="small"
                hideHeader={false}
                headerActions={
                    user.company_id ? null : headerActions
                }
            >
                <Suspense fallback={<SkeletonEntries />}>
                    <Await resolve={workEntriesData}>
                        {(data: any) => {
                            const { workEntries, pageInfo } = data;

                            return (
                                <>
                                    <UserEntriesTable
                                        entries={workEntries}
                                        pageInfo={pageInfo}
                                        onPageChange={handlePageChange}
                                        pageSize={take}
                                        baseUrl={`/company/work-entries/${client.id}`}
                                    />
                                    <Outlet context={{ refreshResults, client }} />
                                </>
                            );
                        }}
                    </Await>
                </Suspense>
            </ContentLayout>
        </DashboardLayout>
    );
}
// routes/admin/advanced/contacts/$companyId.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { message } from "antd";
import { UserRole } from "~/features/Users/Interfaces/users.interface";
import EditCompanyForm from "~/features/Companies/Forms/Company/EditCompanyForm";

export const loader: LoaderFunction = async ({ request, params }) => {
    const companyId = params.companyId;
    if (!companyId) {
        throw new Response("companyId is required", { status: 400 });
    }

    return withTwoResourcesDefer({
        request,
        sessionCheck: () => getSessionFromCookie(request),
        resources: [
            { key: "client", apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,timezone,currentStatus,account_manager_id` },
            { key: "usersAccountManagerData", apiPath: `${process.env.APP_URL}/api/users?filter=is_account_manager&take=100&fields=id,name` },
        ],
    });
};

export default function ClientContactsPage() {
    const { client } = useLoaderData<typeof loader>();
    const { data: usersData } = useCursorPagination("usersAccountManagerData");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const payload = { ...values };
            const companyFormData = new FormData();
            companyFormData.append("client", JSON.stringify(payload));

            const res = await fetch(`/api/clients/${client.id}`, {
                method: "PUT",
                body: companyFormData,
            });

            if (res.ok) {
                message.success("Company updated successfully");
            } else {
                message.error("Error updating Company");
            }
        } catch (err) {
            message.error("Error updating Company");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout
            title={client.company}
            type="client_section"
            id={client.id}
            companyStatus={client.currentStatus}
            menuType={UserRole.USER}
        >
            <ContentLayout
                title="Edit Company details"
                type="basic_section"
                size="small"
                hideHeader={false}
            >
                <Suspense fallback={<SkeletonEntries />}>
                    <Await resolve={usersData}>
                        {(data: any) => {
                            const { users } = data;

                            return (
                                <>
                                    <EditCompanyForm
                                        client={client}
                                        handleSubmit={handleSubmit}
                                        submitting={submitting}
                                        edit={true}
                                        users={users}
                                        admin={false}
                                    />
                                </>
                            );
                        }}
                    </Await>
                </Suspense>
            </ContentLayout>
        </DashboardLayout>
    );
}
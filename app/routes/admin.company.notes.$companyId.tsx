// routes/admin/advanced/contacts/$companyId.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { message } from "antd";
import ClientStatusHistoryForm from "~/components/views/clientStatus/ClientStatusHistoryForm";

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
      { key: "usersAccountManagerData", apiPath: `${process.env.APP_URL}/api/users?fields=id` },
    ],
  });
};

export const meta: MetaFunction = () => [
  { title: "Company Notes | Sentinelux" },
  { name: "description", content: "Notes page from Sentinelux Admin" },
];

export default function ClientNotes() {
    const { client } = useLoaderData<typeof loader>();
    const { data: usersData } = useCursorPagination("usersAccountManagerData");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const payload = { ...values, clientId: client.id };
            const notesFormData = new FormData();
            notesFormData.append("history", JSON.stringify(payload));

            const res = await fetch(`/api/client-status-history`, {
                method: "POST",
                body: notesFormData,
            });

            if (res.ok) {
                message.success("Note created successfully");
            } else {
                message.error("Error creating Note");
            }
        } catch (err) {
            message.error("Error updating note");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout title={client.company} type="client_section" id={client.id} companyStatus={client.currentStatus}>
            <ContentLayout
                title="Create Note"
                type="basic_section"
                size="small"
                hideHeader={false}
            >
                <Suspense fallback={<SkeletonEntries />}>
                    <Await resolve={usersData}>
                        {(data: any) => {
                            return (
                                <>
                                    <ClientStatusHistoryForm
                                        handleSubmit={handleSubmit}
                                        submitting={submitting}
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
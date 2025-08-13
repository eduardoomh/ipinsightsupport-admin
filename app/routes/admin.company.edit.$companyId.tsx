// routes/admin/advanced/contacts/$companyId.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";

export const loader: LoaderFunction = async ({ request, params }) => {
  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("companyId is required", { status: 400 });
  }

  return withTwoResourcesDefer({
    request,
    sessionCheck: () => getSessionFromCookie(request),
    resources: [
      { key: "client", apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,timezone,currentStatus` },
      { key: "usersAccountManagerData", apiPath: `${process.env.APP_URL}/api/users?filter=is_account_manager&take=100&fields=id,name` },
    ],
  });
};

export default function ClientContactsPage() {
  const { client, take } = useLoaderData<typeof loader>();
  const { data: usersData, handlePageChange } = useCursorPagination("usersAccountManagerData");

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id}>
      <ContentLayout
        title="Edit Company details"
        type="basic_section"
        size="small"
        hideHeader={false}
      >
        <Suspense fallback={<SkeletonEntries />}>
          <Await resolve={usersData}>
            {(data: any) => {
              const { contacts, pageInfo } = data;

              return (
                <>
                  <p>Form</p>
                </>
              );
            }}
          </Await>
        </Suspense>
      </ContentLayout>
    </DashboardLayout>
  );
}
// routes/admin/entries/$id.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, Outlet, useParams, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import AdminWorkEntriesTable from "~/components/views/entries/AdminWorkEntriesTable";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;
  if (!userId) {
    throw new Response("userId is required", { status: 400 });
  }

  return withTwoResourcesDefer({
    request,
    sessionCheck: () => getSessionFromCookie(request),
    resources: [
      {
        key: "workEntriesData",
        apiPath: `${process.env.APP_URL}/api/work-entries?user_id=${userId}`,
      },
      {
        key: "userExtraData",
        apiPath: `${process.env.APP_URL}/api/users/${userId}`,
      },
    ],
  });
};

export default function UserEntriesPage() {
  const { userId } = useParams();
  const { workEntriesData, userExtraData } = useLoaderData<typeof loader>();

  const { data: paginatedEntries, take, handlePageChange } = useCursorPagination("workEntriesData");
  const refreshResults = useRefreshAndResetPagination(`/admin/user/work-entries/${userId}`);

  return (
    <Suspense fallback={<DashboardLayout title="Loading user..."><SkeletonEntries /></DashboardLayout>}>
      <Await resolve={userExtraData}>
        {(user: any) => (
          <DashboardLayout title={`${user?.name || "Unknown User"}'s Work Entries`}>
            <Suspense fallback={<SkeletonEntries />}>
              <Await resolve={paginatedEntries}>
                {(data: any) => {
                  const { workEntries, pageInfo } = data;

                  return (
                    <>
                      <AdminWorkEntriesTable
                        entries={workEntries}
                        pageInfo={pageInfo}
                        onPageChange={handlePageChange}
                        pageSize={take}
                        baseUrl={`/admin/user/work-entries/${userId}`}
                      />
                      <Outlet context={{ refreshResults }} />
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </DashboardLayout>
        )}
      </Await>
    </Suspense>
  );
}
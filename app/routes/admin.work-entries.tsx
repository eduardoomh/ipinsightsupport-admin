// routes/admin/advanced/work-entries/index.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import AdminWorkEntriesTable from "~/components/views/entries/AdminWorkEntriesTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/work-entries`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntries",
  });
};

export default function AdminWorkEntries() {
  const { data: workEntriesData, take, handlePageChange } = useCursorPagination("workEntries");

  return (
    <DashboardLayout title="Work entries">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={workEntriesData}>
          {(data: any) => {
            const { workEntries, pageInfo } = data;

            return (
              <AdminWorkEntriesTable
                entries={workEntries}
                pageInfo={pageInfo}
                onPageChange={handlePageChange}
                pageSize={take}
              />
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
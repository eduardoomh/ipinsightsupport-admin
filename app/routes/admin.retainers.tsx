// routes/admin/advanced/retainers/admin.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  useLoaderData
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import NoData from "~/components/basics/NoData";
import RetainersTable from "~/components/views/retainers/RetainersTable";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/retainers`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "retainersData",
  });
};

export default function StatusRetainers() {
  const { data: retainersData, take, handlePageChange } = useCursorPagination("retainersData");

  return (
    <DashboardLayout title="Retainers">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={retainersData}>
          {(data: any) => {
            const { retainers, pageInfo } = data;

            return (
              <RetainersTable
                retainers={retainers}
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
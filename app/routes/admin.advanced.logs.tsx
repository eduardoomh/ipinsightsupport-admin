import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Outlet } from "@remix-run/react";
import { Suspense } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import LogsTable from "~/components/views/logs/LogsTable";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/logs`);

  if (filter === "date" && from && to) {
    apiUrl.searchParams.set("filter", "date");
    apiUrl.searchParams.set("from", from);
    apiUrl.searchParams.set("to", to);
  } else if (filter === "recent") {
    apiUrl.searchParams.set("filter", "recent");
  }

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "logsData",
  });
};


export const meta: MetaFunction = () => [
  { title: "Manage Logs | Sentinelux" },
  { name: "description", content: "Manage Logs page from Sentinelux Admin" },
];

export default function AdminManageLogs() {
   const { data: logsData, take, handlePageChange } = useCursorPagination("logsData");
    const refreshResults = useRefreshAndResetPagination("/admin/advanced/logs");
    
  return (
    <DashboardLayout title="Manage logs" headerActions={null}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={logsData}>
          {(data: any) => {
            const { logs, pageInfo } = data;

            return (
              <>
                <LogsTable
                  logs={logs}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                  pageSize={take}
                />
                <Outlet context={{ refreshResults }} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
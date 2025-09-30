import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await } from "@remix-run/react";
import { Suspense } from "react";
import NoData from "~/components/basics/NoData";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import ReportActions from "~/components/views/reports/ReportActions";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useReportFilters } from "~/hooks/useReportFilters";
import UserReportTable from "~/components/views/reports/UseReportTable";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const companyId = url.searchParams.get("company_id");
  const userId = url.searchParams.get("user_id");

  const apiUrl = new URL(`${process.env.APP_URL}/api/users/report-preview`);

  // paginación
  apiUrl.searchParams.set("take", url.searchParams.get("take") || "10");

  // filtros
  if (from && to) {
    apiUrl.searchParams.set("from", from);
    apiUrl.searchParams.set("to", to);
  }
  if (companyId) apiUrl.searchParams.set("company_id", companyId);
  if (userId) apiUrl.searchParams.set("user_id", userId);

  return withPaginationDefer({
    request,
    apiPath: apiUrl.toString(),
    sessionCheck: () => getSessionFromCookie(request),
    key: "reportsData",
  });
};

export const meta: MetaFunction = () => [
  { title: "User Reports | Sentinelux" },
  { name: "description", content: "User Reports page from Sentinelux Admin" },
];

export default function AdminStatusReport() {
  const initialData = useCursorPagination("reportsData");
  const { data: reportsData, take, handlePageChange } = initialData;

  const {
    dateRange,
    setDateRange,
    handleApplyFilter,
  } = useReportFilters();

  const headerActions = (
    <ReportActions
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
    />
  );

  return (
    <DashboardLayout title="User Reports" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={reportsData}>
          {(data: any) => {
            const { users, pageInfo } = data;

            if (!users || users.length === 0) return <NoData />;

            return (
              <UserReportTable 
                users={users} 
                pageInfo={pageInfo} 
                onPageChange={handlePageChange} 
                pageSize={take} />
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}

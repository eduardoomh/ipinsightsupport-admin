// routes/admin/entries/$id.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, Outlet, useParams } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UserEntriesTable from "~/components/views/entries/UserEntriesTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/work-entries?user_id=${userId}`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntriesData",
  });
};

export default function UserEntriesPage() {
  const { userId } = useParams();
  const { data: workEntriesData, take, handlePageChange } = useCursorPagination("workEntriesData");
  const refreshResults = useRefreshAndResetPagination(`/entries/${userId}`);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/work-entries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshResults(); // refresca la tabla después de borrar
      } else {
        console.error("Failed to delete entry");
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <DashboardLayout title="All work entries">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={workEntriesData}>
          {(data: any) => {
            const { workEntries, pageInfo } = data;

            return (
              <>
                <UserEntriesTable
                  entries={workEntries}
                  onDelete={handleDelete}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                  pageSize={take}
                  baseUrl={`/entries/${userId}`}
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
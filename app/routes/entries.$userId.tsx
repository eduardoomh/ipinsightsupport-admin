// routes/admin/entries/$id.tsx
import { LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UserEntriesTable from "~/components/views/entries/UserEntriesTable";
import { WorkEntry } from "~/interfaces/workEntries.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = params.userId;
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/work-entries?user_id=${userId}`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "workEntriesData",
  });
};

export default function UserEntriesPage() {
  const { data: workEntriesData, take, handlePageChange } = useCursorPagination("workEntriesData");
  const [localEntries, setLocalEntries] = useState<WorkEntry[] | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/work-entries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLocalEntries((prev) => prev?.filter((entry) => entry.id !== id) ?? []);
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
            console.log(workEntries, "enttttries")
            const currentEntries = localEntries ?? workEntries;

            // Inicializa `localEntries` solo una vez
            if (!localEntries) setLocalEntries(workEntries);

            return (
              <UserEntriesTable
                entries={currentEntries}
                onDelete={handleDelete}
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
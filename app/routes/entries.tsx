import { defer, LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData, redirect } from "@remix-run/react";
import { Suspense, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import AllEntriesTable from "~/components/views/entries/AllEntriesTable";
import { WorkEntry } from "~/interfaces/workEntries.interface";
import { delay } from "~/utils/general/delay";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const fetchEntries = async () => {
    const res = await fetch(`${process.env.APP_URL}/api/work-entries`);
    const data = await res.json();
    return delay(500, data);
  };

  return defer({
    workEntries: fetchEntries(),
  });
};

export default function EntriesPage() {
  const { workEntries } = useLoaderData<typeof loader>();
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
        <Await resolve={workEntries}>
          {(resolvedEntries: WorkEntry[]) => {
            const currentEntries = localEntries ?? resolvedEntries;

            // Inicializa `localEntries` solo una vez
            if (!localEntries) setLocalEntries(resolvedEntries);

            return (
              <AllEntriesTable entries={currentEntries} onDelete={handleDelete} />
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
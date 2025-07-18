import { defer, LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData, redirect } from "@remix-run/react";
import { Suspense, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsTable from "~/components/views/clients/ClientsTable";
import { ClientI } from "~/interfaces/clients.interface";
import { delay } from "~/utils/general/delay";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const fetchClients = async () => {
    const res = await fetch(`${process.env.APP_URL}/api/clients`);
    const data = await res.json();
    return delay(500, data);
  };

  return defer({
    clients: fetchClients(),
  });
};

export default function ClientsPage() {
  const { clients } = useLoaderData<typeof loader>();
  const [localClients, setLocalClients] = useState<ClientI[] | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLocalClients((prev) => prev?.filter((entry) => entry.id !== id) ?? []);
      } else {
        console.error("Failed to delete client");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  return (
    <DashboardLayout title="Manage clients">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={clients}>
          {(resolvedClients: ClientI[]) => {
            const currentClients = localClients ?? resolvedClients;

            // Inicializa `localEntries` solo una vez
            if (!localClients) setLocalClients(resolvedClients);

            return (
              <ClientsTable clients={currentClients} onDelete={handleDelete} />
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
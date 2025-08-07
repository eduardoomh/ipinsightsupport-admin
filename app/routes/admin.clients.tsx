import { defer, LoaderFunction } from "@remix-run/node";
import { Await, redirect, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsAdminTable from "~/components/views/clients/ClientsAdminTable";
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
export default function AdminClients() {
    const { clients } = useLoaderData<typeof loader>();
    const [localClients, setLocalClients] = useState<ClientI[] | null>(null);
    
  return (
    <DashboardLayout title="Clients">
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={clients}>
          {(resolvedClients: ClientI[]) => {
            const currentClients = localClients ?? resolvedClients;

            // Inicializa `localEntries` solo una vez
            if (!localClients) setLocalClients(resolvedClients);

            return (
              <>
                <ClientsAdminTable clients={currentClients} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}
// routes/admin/advanced/clients/admin.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Await,
  useFetcher,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";
import { Suspense, useState, useEffect } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ClientsAdminTable from "~/components/views/clients/ClientsAdminTable";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const currentStatus = url.searchParams.get("currentStatus");

  const apiPath = `${process.env.APP_URL}/api/clients?relations=team_members,account_manager&last_note=true${
    currentStatus ? `&currentStatus=${currentStatus}` : ""
  }`;

  return withPaginationDefer({
    request,
    apiPath,
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Companies | Sentinelux" },
  { name: "description", content: "Companies page from Sentinelux Admin" },
];

const ClientStatus = {
  ALL: "SHOW ALL",
  ADHOC: "ADHOC",
  IN_PROGRESS: "IN_PROGRESS",
  ARCHIVE: "ARCHIVE",
  WAITING_ON_AM: "WAITING_ON_AM",
  WAITING_ON_CLIENT: "WAITING_ON_CLIENT",
  TRANSFER: "TRANSFER",
} as const;

export default function AdminClients() {
  const initialData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado que guarda la promesa de datos
  const [dataPromise, setDataPromise] = useState(initialData.clientsData);

  // Manejo de cambio de filtro
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;

    const fetcherParams = new URLSearchParams();
    if (newStatus && newStatus !== "SHOW ALL") {
      fetcherParams.set("currentStatus", newStatus);
    }

    fetcher.submit(fetcherParams, { method: "get" });
    setSearchParams(fetcherParams);
  };

  // Actualizar dataPromise cuando fetcher traiga datos nuevos
  useEffect(() => {
    if (fetcher.data) {
      //@ts-ignore
      setDataPromise(fetcher.data.clientsData);
    }
  }, [fetcher.data]);

  const { data: clientsData, take, handlePageChange } =
    useCursorPagination("clientsData");

  // Header con filtro
  const headerActions = (
    <div className="flex flex-col items-center space-x-2 mr-4">
      <label
        htmlFor="currentStatus"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        Filter by Status:
      </label>

      <select
        id="currentStatus"
        name="currentStatus"
        defaultValue={searchParams.get("currentStatus") || "SHOW ALL"}
        onChange={handleStatusChange}
        className="block w-full rounded-md border-2 border-gray-400 bg-white py-1 px-3 text-base font-medium shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-300 sm:text-base"
      >
        {Object.entries(ClientStatus).map(([key, value]) => (
          <option key={key} value={value}>
            {getClientStatusLabel(value as any)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <DashboardLayout title="Companies" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={dataPromise}>
          {(data: any) => {
            const { clients, pageInfo } = data;

            return (
              <ClientsAdminTable
                clients={clients}
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
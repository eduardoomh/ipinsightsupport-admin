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

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import ClientsUserTable from "~/components/views/clients/ClientsUserTable";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";
import CompaniesByUserTable from "~/features/Companies/Tables/CompaniesByUser/CompaniesByUserTable";

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const currentStatus = url.searchParams.get("currentStatus");
  const userId = params.userId;
  const apiPath = `${process.env.APP_URL}/api/clients?relations=team_members,account_manager&user_id=${userId}${currentStatus ? `&currentStatus=${currentStatus}` : ''}`;

  return withPaginationDefer({
    request,
    apiPath,
    sessionCheck: () => getSessionFromCookie(request),
    key: "clientsData",
  });
};

const ClientStatus = {
  ALL: 'SHOW ALL',
  ADHOC: 'ADHOC',
  IN_PROGRESS: 'IN_PROGRESS',
  ARCHIVE: 'ARCHIVE',
  WAITING_ON_AM: 'WAITING_ON_AM',
  WAITING_ON_CLIENT: 'WAITING_ON_CLIENT',
  TRANSFER: 'TRANSFER'
};

export const meta: MetaFunction = () => [
  { title: "Companies | Sentinelux" },
  { name: "description", content: "Companies page from Sentinelux" },
];

export default function AdminClients() {
  const initialData = useLoaderData();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  //@ts-ignore
  const [dataPromise, setDataPromise] = useState(initialData.clientsData);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    // Create new URLSearchParams for the fetcher
    const fetcherParams = new URLSearchParams();
    if (newStatus && newStatus !== 'SHOW ALL') { // <-- FIXED
      fetcherParams.set("currentStatus", newStatus);
    }

    // Submit the fetcher with the new parameters
    fetcher.submit(fetcherParams, { method: "get" });

    // Update the URL in the address bar
    setSearchParams(fetcherParams);
  };

  // This useEffect watches the fetcher's state to update the promise for Await
  useEffect(() => {
    if (fetcher.data) {
      //@ts-ignore
      setDataPromise(fetcher.data.clientsData);
    }
  }, [fetcher.data]);

  const { data: clientsData, take, handlePageChange } = useCursorPagination("clientsData");

  const headerActions = (
    <div className="flex flex-col items-center space-x-2 mr-4">
      <label htmlFor="currentStatus" className="text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>

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
              <CompaniesByUserTable
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
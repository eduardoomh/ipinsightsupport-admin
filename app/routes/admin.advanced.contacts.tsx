// routes/admin/advanced/contacts/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Await, Outlet } from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ContactsTable from "~/components/views/contacts/ContactsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import { useFilters } from "~/hooks/useFilters";
import HeaderActions from "~/components/TableActions/HeaderActions";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const apiUrl = new URL(`${process.env.APP_URL}/api/contacts`);

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
    key: "contactsData",
  });
};

export const meta: MetaFunction = () => [
  { title: "Manage Contacts | Sentinelux" },
  { name: "description", content: "Manage Contacts page from Sentinelux Admin" },
];

export default function ContactsPage() {
  const { data: contactsData, take, handlePageChange } = useCursorPagination("contactsData");
  const refreshResults = useRefreshAndResetPagination("/admin/advanced/contacts");
  const deleteContact = useDeleteResource("/api/contacts", refreshResults);

  // --- Filtros tipo admin ---
  const {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    handleApplyFilter,
    handleResetFilter,
  } = useFilters();

  // --- Botón de crear contacto ---
  const createButton = useDashboardHeaderActions("/admin/advanced/contacts/new", "Create");

  // --- Combinamos filtros + createButton en HeaderActions ---
  const headerActions = (
    <HeaderActions
      title="Filter contacts"
      path="/api/contacts"
      fileName="contacts"
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      createButton={{
        label: "Create",
        path: "/admin/advanced/contacts/new"
      }}
    />
  );

  return (
    <DashboardLayout title="Manage contacts" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={contactsData}>
          {(data: any) => {
            const { contacts, pageInfo } = data;

            return (
              <>
                <ContactsTable
                  contacts={contacts}
                  onDelete={deleteContact}
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
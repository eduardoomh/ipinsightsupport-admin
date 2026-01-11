// routes/admin/advanced/contacts/index.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import ContactsTable from "~/features/Contacts/Tables/ContactsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useFilters } from "~/hooks/useFilters";
import TableFilters from "~/components/TableActions/TableFilters";
import { TableView } from "~/components/TableActions/TableView";
import { useLoaderData } from "@remix-run/react";
import ContactsSkeleton from "~/features/Contacts/Fallbacks/ContactsSkeleton";
import { buildApiUrl } from "~/utils/api/buildApiUrl";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: buildApiUrl(request, "/api/contacts", ["filter", "from", "to"]),
    sessionCheck: () => getSessionFromCookie(request),
    key: "contacts",
  });
};

export const meta: MetaFunction = () => [
  { title: "Manage Contacts | Sentinelux" },
  { name: "description", content: "Manage Contacts page from Sentinelux Admin" },
];

export default function ContactsPage() {
  const { contacts } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("contacts");

  const { filterValues, filterActions } = useFilters();

  const createButtonConfig = {
    label: "Create Contact",
    path: "/admin/advanced/contacts/new"
  };

  const headerActions = (
    <TableFilters
      title={"Manage Contacts"}
      path="/api/contacts"
      fileName="contacts"
      filterValues={filterValues}
      filterActions={filterActions}
      createButton={createButtonConfig}
    />
  );

  return (
    <>
      <TableView
        resolve={contacts}
        skeleton={<ContactsSkeleton />}
        headerActions={headerActions}
        baseUrl="/admin/advanced/contacts"
      >
        {(contacts, pageInfo) => (
          <ContactsTable
            contacts={contacts as any}
            pageInfo={pageInfo}
            onPageChange={handlePageChange}
            pageSize={take}
          />
        )}
      </TableView>
    </>
  );
}
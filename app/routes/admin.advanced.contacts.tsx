// routes/admin/advanced/contacts/index.tsx
import { LoaderFunction } from "@remix-run/node";
import {
  Await,
  Outlet,
  useNavigate,
  useRevalidator
} from "@remix-run/react";
import { Suspense } from "react";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import ContactsTable from "~/components/views/contacts/ContactsTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withPaginationDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useDeleteResource } from "~/hooks/useDeleteResource";
import { useDashboardHeaderActions } from "~/hooks/useDashboardHeaderActions";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";

export const loader: LoaderFunction = async ({ request }) => {
  return withPaginationDefer({
    request,
    apiPath: `${process.env.APP_URL}/api/contacts`,
    sessionCheck: () => getSessionFromCookie(request),
    key: "contactsData",
  });
};

export default function ContactsPage() {
  const { data: contactsData, take, handlePageChange } = useCursorPagination("contactsData");
  const deleteContact = useDeleteResource("/api/contacts");
  const headerActions = useDashboardHeaderActions("/admin/advanced/contacts/new", "Create Contact");
  const refreshResults = useRefreshAndResetPagination("/admin/advanced/contacts");

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
import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import PersonalEntriesTable from "~/components/views/entries/PersonalEntriesTable";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function PersonalEntries() {
  return (
        <DashboardLayout
          title={`Personal entries`}
        >
          <PersonalEntriesTable />
        </DashboardLayout>
  );
}
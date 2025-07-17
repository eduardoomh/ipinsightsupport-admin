import { LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AllEntriesTable from "~/components/views/entries/AllEntriesTable";
import { AppModeProvider } from "~/context/AppModeContext";
import { UserContext } from "~/context/UserContext";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function Entries() {
  return (
        <DashboardLayout
          title={`All work entries`}
        >
          <AllEntriesTable />
        </DashboardLayout>
  );
}
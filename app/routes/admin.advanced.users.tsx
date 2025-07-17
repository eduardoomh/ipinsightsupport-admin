import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import NoData from "~/components/basics/NoData";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function AdminManageUsers() {
  return (
        <DashboardLayout
          title={`Manage Users`}
        >
          <NoData />
        </DashboardLayout>
  );
}
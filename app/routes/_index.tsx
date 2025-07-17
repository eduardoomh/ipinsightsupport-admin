import { LoaderFunction, redirect } from "@remix-run/node";
import EmptyPage from "~/components/basics/EmptyPage";
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

export default function Index() {
  return (
        <DashboardLayout
          title={`Home`}>
          <NoData />

        </DashboardLayout>

  );
}
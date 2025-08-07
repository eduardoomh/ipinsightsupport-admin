import { LoaderFunction, redirect } from "@remix-run/node";
import NoData from "~/components/basics/NoData";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  
  console.log(session, "veremos")

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
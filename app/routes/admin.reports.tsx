import { LoaderFunction, MetaFunction } from "@remix-run/node";
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

export const meta: MetaFunction = () => [
  { title: "Reports | Sentinelux" },
  { name: "description", content: "Reports page from Sentinelux Admin" },
];

export default function AdminStatusReport() {
  return (
        <DashboardLayout
          title={`Reports`}
        >
          <NoData />
        </DashboardLayout>
  );
}
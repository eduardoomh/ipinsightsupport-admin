import React, { useEffect, useState } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import ClientOnly from "~/components/ClientOnly";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) {
    return redirect("/login");
  }

  const { userId, role, name, email } = session;
  return json({ userId, role, name, email });
};

export default function Schedule() {
  const { name, role, email, userId } = useLoaderData<typeof loader>();
  const [CalendarComponent, setCalendarComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // Esto lo ejecuta solo en el cliente
    import("~/components/views/schedule/Calendar").then((mod) => {
      setCalendarComponent(() => mod.default);
    });
  }, []);

  return (
    <DashboardLayout
      title={`The Schedule`}
      user={{ id: userId, name, email, role }}
    >
      {CalendarComponent && (
        <ClientOnly>
          <CalendarComponent />
        </ClientOnly>
      )}
    </DashboardLayout>
  );
}
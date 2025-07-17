import React, { useEffect, useState } from "react";
import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import ClientOnly from "~/components/ClientOnly";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function Schedule() {
  const [CalendarComponent, setCalendarComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // Esto lo ejecuta solo en el cliente
    import("~/components/views/schedule/Calendar2").then((mod) => {
      setCalendarComponent(() => mod.default);
    });
  }, []);

  return (
        <DashboardLayout
          title={`The Schedule`}>
          {CalendarComponent && (
            <ClientOnly>
              <CalendarComponent />
            </ClientOnly>
          )}
        </DashboardLayout>
  );
}
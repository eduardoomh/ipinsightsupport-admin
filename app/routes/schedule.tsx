import React, { useEffect, useState } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import ClientOnly from "~/components/ClientOnly";
import { UserContext } from "~/context/UserContext";
import { AppModeProvider } from "~/context/AppModeContext";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) {
    return redirect("/login");
  }

  const { userId, role, name, email } = session;
  return json({ userId, role, name, email });
};

export default function Schedule() {
  const user = useLoaderData<typeof loader>();
  const [CalendarComponent, setCalendarComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // Esto lo ejecuta solo en el cliente
    import("~/components/views/schedule/Calendar2").then((mod) => {
      setCalendarComponent(() => mod.default);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <AppModeProvider>
        <DashboardLayout
          title={`The Schedule`}>
          {CalendarComponent && (
            <ClientOnly>
              <CalendarComponent />
            </ClientOnly>
          )}
        </DashboardLayout>
      </AppModeProvider>
    </UserContext.Provider>
  );
}
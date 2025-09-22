import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import Dashboard from "~/components/views/home/Dashboard";
import { UserContext } from "~/context/UserContext";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  if (session.company_id && session.role === "CLIENT") {
    return redirect(`/company/dashboard/${session.company_id}`)
  }

  return null;
};

export const meta: MetaFunction = () => [
  { title: "Dashboard | Sentinelux" },
  { name: "description", content: "Dashboard page from Sentinelux" },
];

export default function Index() {
  const user = useContext(UserContext);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      setLoading(true);

      const month = dayjs().month() + 1; // Mes actual (1-12)
      const year = dayjs().year();       // Año actual

      try {
        const res = await fetch(
          `/api/user-stats?user_id=${user.id}&month=${month}&year=${year}`
        );

        if (!res.ok) throw new Error("Error fetching stats");

        const data = await res.json();
        setStats(data.userStats?.[0] || null); // Tomamos el primer elemento si existe
      } catch (err) {
        console.error(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <DashboardLayout title={`Hello, ${user.name}!`}>
      <Dashboard
        totalWorkEntries={stats?.total_work_entries ?? 0}
        companiesAsAccountManager={stats?.companies_as_account_manager ?? 0}
        companiesAsTeamMember={stats?.companies_as_team_member ?? 0}
        hoursEngineering={stats?.hours_engineering ?? 0}
        hoursArchitecture={stats?.hours_architecture ?? 0}
        hoursSeniorArchitecture={stats?.hours_senior_architecture ?? 0}
        todayEvents={[]}
        loading={loading}
      />
    </DashboardLayout>
  );
}
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
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
    return redirect(`/company/dashboard/${session.company_id}`);
  }

  return null;
};

export const meta: MetaFunction = () => [
  { title: "Dashboard | Sentinelux" },
  { name: "description", content: "Dashboard page from Sentinelux" },
];

const { Option } = Select;

// Componente para seleccionar mes y año
const MonthYearSelector = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}) => {
  const now = dayjs();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => now.year() - i);

  return (
    <Space style={{ marginBottom: 16 }}>
      <Select
        value={selectedMonth}
        onChange={(val) => setSelectedMonth(val)}
        style={{ width: 120 }}
      >
        {months.map((m) => (
          <Option key={m} value={m}>
            {dayjs().month(m - 1).format("MMMM")}
          </Option>
        ))}
      </Select>

      <Select
        value={selectedYear}
        onChange={(val) => setSelectedYear(val)}
        style={{ width: 100 }}
      >
        {years.map((y) => (
          <Option key={y} value={y}>
            {y}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default function Index() {
  const user = useContext(UserContext);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const now = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(now.month() + 1);
  const [selectedYear, setSelectedYear] = useState(now.year());

  const fetchStats = async (month: number, year: number) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user-stats?user_id=${user.id}&month=${month}&year=${year}`
      );
      if (!res.ok) throw new Error("Error fetching stats");
      const data = await res.json();
      setStats(data.userStats?.[0] ?? null);
    } catch (err) {
      console.error(err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedMonth, selectedYear);
  }, [user, selectedMonth, selectedYear]);

  return (
    <DashboardLayout
      title={`Hello, ${user.name}!`}
      headerActions={
        <MonthYearSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      }
    >
      <Dashboard
        totalWorkEntries={stats?.total_work_entries ?? 0}
        companiesAsAccountManager={stats?.companies_as_account_manager ?? 0}
        companiesAsTeamMember={stats?.companies_as_team_member ?? 0}
        hoursEngineering={stats?.hours_engineering ?? 0}
        hoursArchitecture={stats?.hours_architecture ?? 0}
        hoursSeniorArchitecture={stats?.hours_senior_architecture ?? 0}
        todayEvents={[]}
        loading={loading}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </DashboardLayout>
  );
}
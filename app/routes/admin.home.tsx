import { MetaFunction } from "@remix-run/node";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Select, Space } from "antd";
import DashboardLayout from "~/components/layout/DashboardLayout";
import AdminDashboard from "~/components/views/home/AdminDashboard";

interface AdminStats {
  id: string;
  month: number;
  year: number;
  total_work_entries: number;
  total_retainers: number;
  total_clients: number;
  retainers_amount: number;
  hours_total: number;
  hours_engineering: number;
  hours_architecture: number;
  hours_senior_architecture: number;
}

export const meta: MetaFunction = () => [
  { title: "Admin Home | Sentinelux" },
  { name: "description", content: "Home page from Sentinelux Admin" },
];

const { Option } = Select;

// Componente separado para los filtros de mes y año
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

export default function AdminHome() {
  const now = dayjs();

  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(now.month() + 1);
  const [selectedYear, setSelectedYear] = useState(now.year());

  const fetchAdminStats = async (month: number, year: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin-stats?month=${month}&year=${year}`);
      const json = await res.json();
      const stats: AdminStats | null = json.adminStats?.[0] ?? null;
      setAdminStats(stats);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <DashboardLayout
      title="Dashboard"
      headerActions={
        <MonthYearSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      }
    >
      <AdminDashboard 
        adminStats={adminStats} 
        loading={loading} 
        selectedMonth={selectedMonth} 
        selectedYear={selectedYear} 
      />
    </DashboardLayout>
  );
}
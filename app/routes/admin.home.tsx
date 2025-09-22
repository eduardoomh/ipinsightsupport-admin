import { MetaFunction } from "@remix-run/node";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
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

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const now = dayjs();
        const res = await fetch(`/api/admin-stats?month=${now.month() + 1}&year=${now.year()}`);
        const json = await res.json();
        const stats: AdminStats | null = json.adminStats?.[0] ?? null;
        setAdminStats(stats);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);
  return (
    <DashboardLayout title={`Dashboard`}>
      <AdminDashboard adminStats={adminStats} loading={loading} />
    </DashboardLayout>
  );
}
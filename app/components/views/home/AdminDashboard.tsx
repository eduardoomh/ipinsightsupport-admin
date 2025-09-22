import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import dayjs from "dayjs";
import StatsCard from "./utils/StatsCard";
import WorkEntriesChart from "./utils/WorkEntriesChart";

interface Props{
    adminStats: any;
    loading: boolean;
}

const AdminDashboard: React.FC<Props> = ({ adminStats, loading }) => {
  const [workEntriesData, setWorkEntriesData] = useState<{ date: string; hours: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // 📈 Fetch work entries data (igual que en Dashboard)
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch("/api/work-entries/stats?admin=true");
        const json = await res.json();
        const data: any[] = json.workEntries || [];

        const grouped: Record<string, number> = {};
        data.forEach(entry => {
          const date = dayjs(entry.billed_on).format("YYYY-MM-DD");
          const hours = Number(entry.hours_billed) || 0;
          grouped[date] = (grouped[date] || 0) + hours;
        });

        const chartData = Object.entries(grouped)
          .map(([date, hours]) => ({ date, hours }))
          .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

        setWorkEntriesData(chartData);
      } catch (err) {
        console.error("Error fetching work entries stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-6 space-y-6">
      {/* 🔢 Admin Stats */}
      <Row gutter={16}>
        {[
          ["Total Work Entries", adminStats?.total_work_entries ?? 0],
          ["Total Balances", adminStats?.total_retainers ?? 0],
          ["Total Companies", adminStats?.total_clients ?? 0],
          ["Balances Total Amount", adminStats?.retainers_amount ?? 0],
        ].map(([label, value]) => (
          <Col span={6} key={label}>
            {/* @ts-ignore */}
            <StatsCard label={label} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 📊 Chart */}
      <WorkEntriesChart data={workEntriesData} loading={statsLoading} />

      {/* ⏱ Hours */}
      <Row gutter={16}>
        {[
          ["Total Hours", adminStats?.hours_total ?? 0],
          ["Hours Engineering", adminStats?.hours_engineering ?? 0],
          ["Hours Architecture", adminStats?.hours_architecture ?? 0],
          ["Hours Senior Architecture", adminStats?.hours_senior_architecture ?? 0],
        ].map(([label, value]) => (
          <Col span={6} key={label}>
            {/* @ts-ignore */}
            <StatsCard label={label} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
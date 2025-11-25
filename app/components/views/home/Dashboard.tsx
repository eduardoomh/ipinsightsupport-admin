import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import dayjs from "dayjs";
import StatsCard from "./utils/StatsCard";
import { useNavigate } from "@remix-run/react";
import { userWorkEntriesColumns } from "../entries/utils/userWorkEntriesColumns";
import WorkEntriesChart from "./utils/WorkEntriesChart";
import LastWorkEntryTable from "./utils/LastWorkEntryTable";
import TodayEventsTable from "./utils/TodayEventsTable";

export interface WorkEntry {
  id: string;
  billed_on: string;
  hours_billed: number;
  hours_spent: number;
  hourly_rate: number;
  client: { id: string; company: string };
  user: { id: string; name: string; email: string };
}

interface DashboardProps {
  totalWorkEntries: number;
  companiesAsAccountManager: number;
  companiesAsTeamMember: number;
  hoursEngineering: number;
  hoursArchitecture: number;
  hoursSeniorArchitecture: number;
  todayEvents: { id: string; title: string; time: string }[];
  selectedMonth: number;
  selectedYear: number;
  loading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalWorkEntries,
  companiesAsAccountManager,
  companiesAsTeamMember,
  hoursEngineering,
  hoursArchitecture,
  hoursSeniorArchitecture,
  todayEvents,
  selectedMonth,
  selectedYear,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [workEntriesData, setWorkEntriesData] = useState<{ date: string; hours: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [lastWorkEntryData, setLastWorkEntryData] = useState<WorkEntry | null>(null);
  const [lastLoading, setLastLoading] = useState(false);

  let columns: any = userWorkEntriesColumns(navigate, null);
  columns = columns.filter(item => item.key !== "operation");

  // 📊 Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch(`/api/work-entries/stats?month=${selectedMonth}&year=${selectedYear}`);
        const json = await res.json();
        const data: WorkEntry[] = json.workEntries || [];

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
  }, [selectedMonth, selectedYear]);

  // 📌 Fetch last work entry
  useEffect(() => {
    const fetchLastWorkEntry = async () => {
      setLastLoading(true);
      try {
        const res = await fetch("/api/work-entries/last");
        const json = await res.json();
        const workEntry: WorkEntry | null = json.workEntry || null;
        setLastWorkEntryData(workEntry);
      } catch (err) {
        console.error("Error fetching last work entry:", err);
      } finally {
        setLastLoading(false);
      }
    };

    fetchLastWorkEntry();
  }, []);

  return (
    <div className="py-6 space-y-6">

      <Row gutter={[16, 16]}>
        {[
          ["Total work entries", totalWorkEntries],
          ["Companies as Account Manager", companiesAsAccountManager],
          ["Companies as Team Member", companiesAsTeamMember],
        ].map(([label, value]) => (
          <Col key={label} xs={24} sm={12} md={8}>
            <StatsCard label={label as string} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 📊 Chart */}
      <WorkEntriesChart data={workEntriesData} loading={statsLoading} />

      <Row gutter={[16, 16]}>
        {[
          ["Hours Engineering", hoursEngineering],
          ["Hours Architecture", hoursArchitecture],
          ["Hours Senior Architecture", hoursSeniorArchitecture],
        ].map(([label, value]) => (
          <Col key={label} xs={24} sm={12} md={8}>
            <StatsCard label={label as string} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 📌 Last Work Entry */}
      <LastWorkEntryTable data={lastWorkEntryData as any} columns={columns} loading={lastLoading} />

      {/* 📅 Today Events */}
      <TodayEventsTable events={todayEvents} loading={loading} />
    </div>
  );
};

export default Dashboard;
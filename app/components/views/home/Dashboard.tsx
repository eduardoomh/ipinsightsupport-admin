import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Skeleton } from "antd";
import dayjs from "dayjs";
import StatsCard from "./utils/StatsCard";
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line as ReLine } from "recharts";
import { useNavigate } from "@remix-run/react";

interface WorkEntry {
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
  lastWorkEntry: WorkEntry[];
  todayEvents: { id: string; title: string; time: string }[];
  loading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalWorkEntries,
  companiesAsAccountManager,
  companiesAsTeamMember,
  hoursEngineering,
  hoursArchitecture,
  hoursSeniorArchitecture,
  lastWorkEntry,
  todayEvents,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [workEntriesData, setWorkEntriesData] = useState<{ date: string; entries: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch("/api/work-entries/stats");
        const json = await res.json();
        const data: WorkEntry[] = json.workEntries || [];

        // Agrupar por billed_on
        const grouped: Record<string, number> = {};
        data.forEach(entry => {
          const date = dayjs(entry.billed_on).format("YYYY-MM-DD");
          grouped[date] = (grouped[date] || 0) + 1;
        });

        const chartData = Object.entries(grouped)
          .map(([date, entries]) => ({ date, entries }))
          .sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1);

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
      {/* Stats */}
      <Row gutter={16}>
        {[
          ["Total work entries", totalWorkEntries],
          ["Companies as Account Manager", companiesAsAccountManager],
          ["Companies as Team Member", companiesAsTeamMember]
        ].map(([label, value]) => (
          <Col span={8} key={label}>
            { //@ts-ignore 
            }<StatsCard label={label} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* Work Entries Over Time */}
      <Card
        style={{ border: "1px solid #d3d3d3", marginBottom: '16px' }}
        title={<span style={{ color: "#014a64", fontWeight: 'bold' }}>Work Entries Over Time</span>}
      >
        {statsLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workEntriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <ReLine type="monotone" dataKey="entries" stroke="#1890ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Hours */}
      <Row gutter={16}>
        {[
          ["Hours Engineering", hoursEngineering],
          ["Hours Architecture", hoursArchitecture],
          ["Hours Senior Architecture", hoursSeniorArchitecture]
        ].map(([label, value]) => (
          <Col span={8} key={label}>
            { //@ts-ignore 
            }<StatsCard label={label} value={value as number} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* Last Work Entry */}
      <Card
        style={{ border: "1px solid #d3d3d3", marginBottom: '16px' }}
        title={<span style={{ color: "#014a64", fontWeight: 'bold' }}>Last Work Entry</span>}
      >
        <Table
          dataSource={loading ? [] : lastWorkEntry}
          rowKey="id"
          className="custom-table"
          pagination={false}
          loading={loading}
          columns={[
            { title: "Billed Date", dataIndex: "billed_on", key: "billed_on" },
            {
              title: "Client", dataIndex: "client", render: (_, record) => (
                loading ? <Skeleton.Input style={{ width: 120 }} active /> :
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate(`/company/dashboard/${record.client.id}`)}
                >
                  {record.client.company}
                </span>
              )
            },
            {
              title: "Hours", dataIndex: "hours_billed", render: (_, record) => (
                loading ? <Skeleton.Input style={{ width: 80 }} active /> :
                <div className="leading-snug">
                  <div>{record.hours_billed} hrs billed</div>
                  <div className="text-gray-500 text-sm">{record.hours_spent} hrs spent</div>
                </div>
              )
            },
            {
              title: "Hourly rate", dataIndex: "hourly_rate", render: (data) =>
                loading ? <Skeleton.Input style={{ width: 60 }} active /> : <p>${data}/h</p>
            },
          ]}
        />
      </Card>

      {/* Today Events */}
      <Card
        style={{ border: "1px solid #d3d3d3", marginBottom: '16px' }}
        title={<span style={{ color: "#014a64", fontWeight: 'bold' }}>Today Events</span>}
      >
        <Table
          dataSource={loading ? [] : todayEvents}
          rowKey="id"
          className="custom-table"
          pagination={false}
          loading={loading}
          columns={[
            { title: "Title", dataIndex: "title", key: "title", render: (text) => loading ? <Skeleton.Input style={{ width: 120 }} active /> : text },
            { title: "Time", dataIndex: "time", key: "time", render: (text) => loading ? <Skeleton.Input style={{ width: 80 }} active /> : text },
          ]}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
import React, { useState } from "react";
import { Card, Row, Col, Table, Skeleton } from "antd";
import dayjs from "dayjs";
import StatsCard from "./utils/StatsCard";
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line as ReLine } from "recharts";
import { useNavigate } from "@remix-run/react";

interface DashboardProps {
  totalWorkEntries: number;
  companiesAsAccountManager: number;
  companiesAsTeamMember: number;
  hoursEngineering: number;
  hoursArchitecture: number;
  hoursSeniorArchitecture: number;
  lastWorkEntry: {
    id: string;
    billed_on: string;
    client: { id: string; company: string };
    hours: { hours_spent: number; hours_billed: number };
    hourly_rate: string;
  }[];
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
  const [selectedMonth] = useState<string>(dayjs().month() + 1 + "");

  const workEntriesData = [
    { date: "2025-08-20", entries: 2 },
    { date: "2025-08-21", entries: 5 },
    { date: "2025-08-22", entries: 3 },
    { date: "2025-08-23", entries: 6 },
    { date: "2025-08-24", entries: 4 },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Stats */}
      <Row gutter={16}>
        {[["Total work entries", totalWorkEntries],
          ["Companies as Account Manager", companiesAsAccountManager],
          ["Companies as Team Member", companiesAsTeamMember]].map(([label, value]) => (
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
        {loading ? (
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
        {[["Hours Engineering", hoursEngineering],
          ["Hours Architecture", hoursArchitecture],
          ["Hours Senior Architecture", hoursSeniorArchitecture]].map(([label, value]) => (
            <Col span={8} key={label}>
              {//@ts-ignore
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
              title: "Hours", dataIndex: "hours", render: (_, record) => (
                loading ? <Skeleton.Input style={{ width: 80 }} active /> :
                <div className="leading-snug">
                  <div>{record.hours.hours_billed} hrs billed</div>
                  <div className="text-gray-500 text-sm">{record.hours.hours_spent} hrs spent</div>
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
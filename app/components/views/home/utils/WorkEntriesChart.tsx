import React from "react";
import { Card, Skeleton } from "antd";
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line as ReLine } from "recharts";

interface WorkEntriesChartProps {
  data: { date: string; hours: number }[];
  loading: boolean;
}

const WorkEntriesChart: React.FC<WorkEntriesChartProps> = ({ data, loading }) => {
  return (
    <Card
      style={{ border: "1px solid #d3d3d3", marginBottom: "16px" }}
      title={<span style={{ color: "#014a64", fontWeight: "bold" }}>Work Entries Over Time</span>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <ReLine type="monotone" dataKey="hours" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default WorkEntriesChart;
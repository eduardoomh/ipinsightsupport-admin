import React from "react";
import { Card, Table, Skeleton } from "antd";

interface TodayEvent {
  id: string;
  title: string;
  time: string;
}

interface TodayEventsTableProps {
  events: TodayEvent[];
  loading: boolean;
}

const TodayEventsTable: React.FC<TodayEventsTableProps> = ({ events, loading }) => {
  return (
    <Card
      style={{ border: "1px solid #d3d3d3", marginBottom: "16px" }}
      title={<span style={{ color: "#014a64", fontWeight: "bold" }}>Today Events</span>}
    >
      <Table
        dataSource={loading ? [] : events}
        rowKey="id"
        className="custom-table"
        pagination={false}
        loading={loading}
        columns={[
          { 
            title: "Title", 
            dataIndex: "title", 
            key: "title", 
            render: (text) => loading ? <Skeleton.Input style={{ width: 120 }} active /> : text 
          },
          { 
            title: "Time", 
            dataIndex: "time", 
            key: "time", 
            render: (text) => loading ? <Skeleton.Input style={{ width: 80 }} active /> : text 
          },
        ]}
      />
    </Card>
  );
};

export default TodayEventsTable;
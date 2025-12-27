import React from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { WorkEntry } from '~/features/WorkEntries/Interfaces/workEntries.interface';

interface LastWorkEntryTableProps {
  data: WorkEntry | null;
  columns: ColumnsType<WorkEntry>;
  loading: boolean;
}

const LastWorkEntryTable: React.FC<LastWorkEntryTableProps> = ({ data, columns, loading }) => {
  return (
    <Card
      style={{ border: "1px solid #d3d3d3", marginBottom: "16px" }}
      title={<span style={{ color: "#014a64", fontWeight: "bold" }}>Last Work Entry</span>}
    >
      <Table
        dataSource={loading || !data ? [] : [data]}
        rowKey="id"
        className="custom-table"
        pagination={false}
        loading={loading}
        columns={columns}
      />
    </Card>
  );
};

export default LastWorkEntryTable;
import { Button, Table, TableColumnsType } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { WorkEntry } from "~/interfaces/workEntries.interface";
import { FC, useState } from "react";
import dayjs from "dayjs";

interface DataType {
  id: string;
  billed_on: string;
  client: {
    company: string;
  };
  user: {
    name: string;
  }
  hours_billed: number;
  hours_spent: number;
  summary: string;
  hourly_rate: number;
  created_at: string;
}

interface Props {
  entries: WorkEntry[];
  onDelete?: (id: string) => void;
}

const AdminWorkEntriesTable: FC<Props> = ({ entries }) => {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Billed Date",
      dataIndex: "billed_on",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
      title: "User",
      dataIndex: ["user", "name"],
    },
    {
      title: "Client",
      dataIndex: ["client", "company"],
    },
    {
      title: "Hours",
      key: "hours",
      render: (_: any, record: DataType) => (
        <div className="leading-snug">
          <div>{record.hours_billed} hrs billed</div>
          <div className="text-gray-500 text-sm">{record.hours_spent} hrs spent</div>
        </div>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "created_at",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Hourly rate",
      dataIndex: "hourly_rate",
      render: (value: string) => `$${value}`,
    },
    {
      title: "Actions",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (_: any, record: DataType) => (
        <Button icon={<EditOutlined style={{ fontSize: "16px" }} />}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Table<DataType>
      className="custom-table"
      columns={columns}
      dataSource={entries}
      size="middle"
      rowKey="id"
      expandedRowRender={(record) => (
        <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
          <strong>Summary:</strong>{" "}
          <div dangerouslySetInnerHTML={{ __html: record.summary }} />
        </div>
      )}
      expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
      onExpand={(expanded, record) => {
        setExpandedRowKey(expanded ? record.id : null);
      }}
    />
  );
};

export default AdminWorkEntriesTable;
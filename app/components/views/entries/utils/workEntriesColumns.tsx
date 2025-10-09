// columns/usersColumns.ts
import { Button, TableColumnsType } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DataType } from './workEntries.interface';

export const workEntriesColumns = (
  navigate: (path: string) => void,
  baseUrl: string
): TableColumnsType<DataType> => [
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
      key: "client",
      render: (_: any, record: DataType) => (
        <span
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate(`/admin/company/dashboard/${record.client.id}`)}
        >
          {record.client.company}
        </span>
      ),
    },
    {
      title: "Hours",
      key: "hours",
      render: (_: any, record: DataType) => (
        <div className="leading-snug">
          {
            record?.billing_type === "MONTHLY_PLAN" ?
              <>
                <div className="text-gray-500 text-sm">{record.hours_spent} hrs spent</div>
              </> : (
                <>
                  <div>{record.hours_billed} hrs billed</div>
                  <div className="text-gray-500 text-sm">{record.hours_spent} hrs spent</div>
                </>
              )
          }
        </div>
      ),
    },
    {
      title: "Hourly rate",
      dataIndex: "hourly_rate",
      render: (value: string, record: DataType) => record?.billing_type === "MONTHLY_PLAN" ? "Monthly Plan" : `$${value}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (_: any, record: DataType) => (
        <>
          {record?.billing_type === "MONTHLY_PLAN" ? "Monthly Plan" : `$${record.hourly_rate * record.hours_billed}`}
        </>
      ),
    },
    {
      title: "Actions",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (_: any, record: DataType) => (
        <Button
          icon={<EditOutlined style={{ fontSize: "16px" }} />}
          onClick={() => navigate(`${baseUrl}/edit/${record.id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

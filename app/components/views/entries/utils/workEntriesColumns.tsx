// columns/usersColumns.ts
import { Button, TableColumnsType } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DataType } from './workEntries.interface';
import DateUsFormat from '~/components/tables/DateUsFormat';
import CompanyLink from '~/components/basics/CompanyLink';
import TeamMemberAvatar from '~/components/basics/TeamMemberAvatar';

export const workEntriesColumns = (
  navigate: (path: string) => void,
  baseUrl: string
): TableColumnsType<DataType> => [
    {
      title: "Client",
      key: "client",
      render: (_: any, record: DataType) => (
        <CompanyLink company={record.client.company} id={record.client.id} />
      ),
    },
    {
      title: "Billed Date",
      dataIndex: "billed_on",
      render: (value: string) => <DateUsFormat date={value} />,
    },
    {
      title: "User",
      dataIndex: ["user", "name"],
      render: (_: any, record: DataType) => (
        <TeamMemberAvatar fullName={record.user.name} />
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

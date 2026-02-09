// columns/usersColumns.ts
import { Button, TableColumnsType } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DataType } from '../../Interfaces/workEntries.interface';
import DateUsFormat from '~/components/tables/DateUsFormat';
import CompanyLink from '~/components/basics/CompanyLink';

export const userWorkEntriesColumns = (
  navigate: (path: string) => void,
  baseUrl: string | null
): TableColumnsType<DataType> => [
    {
      title: "Client",
      key: "client",
      render: (_: any, record: DataType) => (
        <CompanyLink company={record.client.company} id={record.client.id} isAdmin={false} />
      ),
    },
    {
      title: "Billed Date",
      dataIndex: "billed_on",
      render: (value: string) => <DateUsFormat date={value} />,
    },
    {
      title: "Hours",
      key: "hours",
      render: (_: any, record: DataType) => {
        const isMonthly = record?.billing_type === "MONTHLY_PLAN";

        return (
          <div className="flex flex-col gap-1 py-1">
            {!isMonthly ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-800">
                    {record.hours_billed} hrs
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-600">
                    Billed
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <span className="text-xs font-medium">{record.hours_spent} hrs spent</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{record.hours_spent} hrs</span>
                  <span className="text-[10px] text-amber-600 font-semibold uppercase">Monthly Plan</span>
                </div>
              </div>
            )}
          </div>
        );
      }
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
          {record?.billing_type === "MONTHLY_PLAN" ? "Monthly Plan" : `${record.hourly_rate * record.hours_billed} USD`}
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

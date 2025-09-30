import { TableColumnsType, Button, message } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { UserReportI } from "./userReport.interface";
import { handleDownloadPDF } from "~/components/pdf/handleDownloadUserPDF";
import { ReportI } from "~/components/pdf/interfaces/Report.interface";

export const userReportColumns = (
  getDateRange: () => { from: string; to: string }
): TableColumnsType<UserReportI> => [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Hours Billed",
    dataIndex: "total_hours_billed",
    key: "total_hours_billed",
    align: "right",
    render: (value: number) => `${value.toFixed(2)} Hours`,
  },
  {
    title: "Hours Spent",
    dataIndex: "total_hours_spent",
    key: "total_hours_spent",
    align: "right",
    render: (value: number) => `${value.toFixed(2)} Hours`,
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: (_: any, record: UserReportI) => (
      <Button
        type="primary"
        className="bg-primary"
        icon={<FileAddOutlined />}
        onClick={async () => {
          const { from, to } = getDateRange();

          try {
            const res = await fetch(
              `/api/users/report?user_id=${record.id}&from=${from}&to=${to}`
            );
            if (!res.ok) throw new Error("Error fetching report");

            const data = await res.json();
            handleDownloadPDF(data as ReportI, data, {
                user: record.name,
                startDate: from,
                endDate: to,
            })
            message.success(`Report generated successfully`);
          } catch (err) {
            console.error(err);
            message.error("Failed to generate report");
          }
        }}
      >
        Generate Report
      </Button>
    ),
  },
];
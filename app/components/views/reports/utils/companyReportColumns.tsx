import { TableColumnsType } from "antd";
import CompanyActions from "../CompanyActions";
import { CompanyReportI } from "./companyReport.interface";

export const companyReportColumns = (
  getDateRange: () => { from: string; to: string }
): TableColumnsType<CompanyReportI> => [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
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
    title: "Balance",
    dataIndex: "total_price",
    key: "total_price",
    align: "right",
    render: (value: number) => `${value.toFixed(2)} USD`,
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: (_: any, record: CompanyReportI) => {
      const { from, to } = getDateRange();
      return <CompanyActions record={record} from={from} to={to} />;
    },
  },
];
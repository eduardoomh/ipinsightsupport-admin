import { Table } from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/features/Companies/Interfaces/clients.interface";
import { PageInfo } from "~/interfaces/pagination.interface";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { useTableLoading } from "~/hooks/useTableLoading";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";
import { companiesAdminColumns } from "~/features/Companies/Tables/AdminCompanies/CompaniesAdminColumns";

interface EstimatedHours {
  estimated_engineering_hours: string | number;
  estimated_architecture_hours: string | number;
  estimated_senior_architecture_hours: string | number;
}

export interface DataType {
  id: string;
  company: string;
  currentStatus: string;
  estimated_hours: EstimatedHours;
  timezone: any;
  team_members: ClientI["team_members"];
  most_recent_work_entry: string;
  most_recent_retainer_activated: string;
}

interface Props {
  clients: ClientI[];
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
}

const ClientsAdminTable: FC<Props> = ({ clients, pageInfo, onPageChange, pageSize }) => {
  const { loading, handlePageChange } = useTableLoading(clients, onPageChange);
  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + clients.length - 1;

  const columns = companiesAdminColumns();

  const dataSource: DataType[] = clients.map((client: ClientI) => ({
    id: client.id,
    company: client.company,
    timezone: getTimezoneLabel(client.timezone as any),
    currentStatus: client.currentStatus,
    team_members: client.team_members || [],
    last_note: client?.lastNote || null,
    estimated_hours: {
      estimated_engineering_hours: client?.estimated_engineering_hours || 0.0,
      estimated_architecture_hours: client?.estimated_architecture_hours || 0.0,
      estimated_senior_architecture_hours: client?.estimated_senior_architecture_hours || 0.0,
    },
    most_recent_work_entry: client.most_recent_work_entry
      ? dayjs(client.most_recent_work_entry).format("YYYY-MM-DD")
      : "—",
    most_recent_retainer_activated: client.most_recent_retainer_activated
      ? dayjs(client.most_recent_retainer_activated).format("YYYY-MM-DD")
      : "—",
  }));

  return (
    <>
      <Table<DataType>
        className="custom-table"
        columns={columns}
        dataSource={dataSource}
        size="middle"
        rowKey="id"
        pagination={false}
        loading={loading}
      />
      <PaginationControls
        currentPage={currentPage}
        pageInfo={pageInfo}
        start={start}
        end={end}
        onPageChange={updatePage}
      />
    </>
  );
};

export default ClientsAdminTable;
import { Table } from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/interfaces/clients.interface";
import { useNavigate } from "@remix-run/react";
import { PageInfo } from "~/interfaces/pagination.interface";
import PaginationControls from "~/components/tables/PaginationControls";
import { clientAdminColumns } from "./utils/clientAdminColumns";
import usePagination from "~/hooks/usePagination";
import { useTableLoading } from "~/hooks/useTableLoading";

interface DataType {
  id: string;
  company: string;
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
  const navigate = useNavigate();

  const { loading, handlePageChange } = useTableLoading(clients, onPageChange);
  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + clients.length - 1;

  const columns = clientAdminColumns(navigate);

  const dataSource: DataType[] = clients.map((client: ClientI) => ({
    id: client.id,
    company: client.company,
    team_members: client.team_members || [],
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
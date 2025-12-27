import { message, Table } from "antd";
import { FC } from "react";
import { ClientI } from "~/interfaces/clients.interface";
import { useNavigate } from "@remix-run/react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { useTableLoading } from "~/hooks/useTableLoading";
import { advancedCompaniesColumns } from "~/features/Companies/Tables/AdvancedCompanies/AdvancedCompaniesColumns";

export interface DataType {
  id: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  clients: ClientI[];
  onDelete?: (id: string) => void;
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
  baseUrl: string;
}

const AdvancedCompaniesTable: FC<Props> = ({ clients, onDelete, pageInfo, onPageChange, pageSize, baseUrl}) => {
  const navigate = useNavigate();

  const { loading, handlePageChange } = useTableLoading(clients, onPageChange);

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      message.success("Client deleted successfully");
    }
  };

  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);

  const end = start + clients.length - 1;
  const columns = advancedCompaniesColumns(navigate, handleDelete, baseUrl);


  return (
    <>
      <Table<DataType>
        className="custom-table"
        columns={columns}
        dataSource={clients}
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

export default AdvancedCompaniesTable;
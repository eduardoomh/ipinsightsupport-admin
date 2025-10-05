import { message, Table } from 'antd';
import { FC } from 'react';
import { useNavigate } from '@remix-run/react';
import { PageInfo } from '~/interfaces/pagination.interface';
import usePagination from '~/hooks/usePagination';
import PaginationControls from '~/components/tables/PaginationControls';
import { useTableLoading } from '~/hooks/useTableLoading';
import { LogI } from './utils/logTable.interface';
import { logColumns } from './utils/logsCoumns';

interface Props {
  logs: LogI[];
  onDelete?: (id: string) => void;
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
  viewAction?: boolean;
}

const LogsTable: FC<Props> = ({ logs, onDelete, pageInfo, onPageChange, pageSize, viewAction = true }) => {
  const navigate = useNavigate();
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      message.success("Log deleted successfully");
    }
  };

  const { loading, handlePageChange } = useTableLoading(logs, onPageChange);
  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + logs.length - 1;

  return (
    <>
      <Table<LogI>
        className="custom-table"
        columns={logColumns(navigate, handleDelete, viewAction)}
        dataSource={logs}
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

export default LogsTable;
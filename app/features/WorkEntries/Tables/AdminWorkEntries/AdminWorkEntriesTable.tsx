import { Table } from "antd";
import { WorkEntry } from "~/interfaces/workEntries.interface";
import { FC, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { PageInfo } from "~/interfaces/pagination.interface";
import { DataType } from "~/components/WorkEntries/Interfaces/workEntries.interface"
import usePagination from "~/hooks/usePagination";
import PaginationControls from "~/components/tables/PaginationControls";
import { useTableLoading } from "~/hooks/useTableLoading";
import { workEntriesColumns } from "~/components/WorkEntries/Tables/AdminWorkEntries/workEntriesColumns";

interface Props {
  entries: WorkEntry[];
  onDelete?: (id: string) => void;
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
  baseUrl: string;
}

const AdminWorkEntriesTable: FC<Props> = ({ entries, pageInfo, onPageChange, pageSize, baseUrl }) => {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const { loading, handlePageChange } = useTableLoading(entries, onPageChange);

  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + entries.length - 1;

  let columns = workEntriesColumns(navigate, baseUrl);

  if(baseUrl.includes("/admin/company/")){
    columns = columns.filter(item => item.key !== 'client')
  }

  return (
    <>
      <Table<DataType>
        className="custom-table"
        columns={columns}
        dataSource={entries as any}
        size="middle"
        rowKey="id"
        pagination={false}
        loading={loading}
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

export default AdminWorkEntriesTable;
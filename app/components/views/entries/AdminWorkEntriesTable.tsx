import { Table } from "antd";
import { WorkEntry } from "~/interfaces/workEntries.interface";
import { FC, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { PageInfo } from "~/interfaces/pagination.interface";
import usePagination from "~/hooks/usePagination";
import { workEntriesColumns } from "./utils/workEntriesColumns"
import PaginationControls from "~/components/tables/PaginationControls";
import { DataType } from "./utils/workEntries.interface"

interface Props {
  entries: WorkEntry[];
  onDelete?: (id: string) => void;
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
}

const AdminWorkEntriesTable: FC<Props> = ({ entries, pageInfo, onPageChange, pageSize }) => {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
  const end = start + entries.length - 1;

  const columns = workEntriesColumns(navigate);

  return (
    <>
      <Table<DataType>
        className="custom-table"
        columns={columns}
        dataSource={entries}
        size="middle"
        rowKey="id"
        pagination={false}
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
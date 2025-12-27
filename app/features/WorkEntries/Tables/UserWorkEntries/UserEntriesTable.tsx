import { Table } from "antd";
import { FC, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useTableLoading } from "~/hooks/useTableLoading";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import PaginationControls from "~/components/tables/PaginationControls";
import { userWorkEntriesColumns } from "./userWorkEntriesColumns";
import { WorkEntry } from '~/features/WorkEntries/Interfaces/workEntries.interface';

interface DataType {
  id: string;
  billed_on: string;
  client: {
    company: string;
  };
  hours_billed: number;
  hours_spent: number;
  summary: string;
  created_at: string;
}

interface Props {
  entries: WorkEntry[];
  onDelete?: (id: string) => void;
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
  baseUrl: string;
}

const UserEntriesTable: FC<Props> = ({ entries, pageInfo, onPageChange, pageSize, baseUrl }) => {
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const { loading, handlePageChange } = useTableLoading(entries, onPageChange);

  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + entries.length - 1;

  let columns = userWorkEntriesColumns(navigate, baseUrl);

  if(baseUrl.includes("company")){
    columns = columns.filter(item => item.key !== 'client')
  }

  return (
    <>
      <Table<DataType>
        className="custom-table"
        //@ts-ignore
        columns={columns}
        dataSource={entries}
        size="middle"
        rowKey="id"
        loading={loading}
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

export default UserEntriesTable;
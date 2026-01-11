import { Table } from "antd";
import { FC, useState } from "react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { BalanceI, BalanceType } from "~/features/Balances/Interfaces/balances.interface";
import { balanceColumns } from "./BalancesColumns";
import { useTableLoading } from "~/hooks/useTableLoading";

interface Props {
    balances: BalanceType[];
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
}

const BalancesTable: FC<Props> = ({ balances, pageInfo, onPageChange, pageSize }) => {
    const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
    const { loading, handlePageChange } = useTableLoading(balances, onPageChange);
    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
    const end = start + balances.length - 1;

    const columns = balanceColumns();

    return (
        <>
            <Table<BalanceI>
                className="custom-table"
                columns={columns}
                dataSource={balances}
                size="middle"
                rowKey="id"
                pagination={false}
                loading={loading}
                expandedRowRender={(record) => (
                    <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
                        <strong>Note:</strong>{" "}
                        <div dangerouslySetInnerHTML={{ __html: record.note || "No note provided" }} />
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

export default BalancesTable;
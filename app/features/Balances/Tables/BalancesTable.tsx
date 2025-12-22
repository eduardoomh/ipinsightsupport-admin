import { Table } from "antd";
import { FC } from "react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { BalanceI, BalanceType } from "~/features/Balances/Interfaces/balances.interface";
import { balanceColumns } from "./BalancesColumns";

interface Props {
    balances: BalanceType[];
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
}

const BalancesTable: FC<Props> = ({ balances, pageInfo, onPageChange, pageSize }) => {
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
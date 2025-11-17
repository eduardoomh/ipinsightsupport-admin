import { Table } from "antd";
import { FC } from "react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { retainerColumns } from "./utils/retainerColumns";
import { RetainerI } from "~/interfaces/retaner.interface";

interface Props {
    retainers: RetainerI[];
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
}

const RetainersTable: FC<Props> = ({ retainers, pageInfo, onPageChange, pageSize }) => {
    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
    const end = start + retainers.length - 1;

    const columns = retainerColumns();

    return (
        <>
            <Table<RetainerI>
                className="custom-table"
                columns={columns}
                dataSource={retainers}
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

export default RetainersTable;
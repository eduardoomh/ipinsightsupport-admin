import { Table } from "antd";
import { FC } from "react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { CompanyReportI } from "./utils/companyReport.interface";
import { companyReportColumns } from "./utils/companyReportColumns";

interface Props {
    clients: CompanyReportI[];
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
    getDateRange?: () => { from: string; to: string };
}

const CompanyReportTable: FC<Props> = ({ clients, pageInfo, onPageChange, pageSize, getDateRange }) => {

    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
    const end = start + clients.length - 1;

    const columns = companyReportColumns(getDateRange);

    return (
        <>
            <Table<CompanyReportI>
                className="custom-table"
                columns={columns}
                dataSource={clients}
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

export default CompanyReportTable;
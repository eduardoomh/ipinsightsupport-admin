import { Table } from "antd";
import { FC } from "react";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { PageInfo } from "~/interfaces/pagination.interface";
import { userReportColumns } from "./utils/userReportColumns";
import { UserReportI } from "./utils/userReport.interface";

interface Props {
    users: UserReportI[];
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
    getDateRange?: () => { from: string; to: string };
}

const UserReportTable: FC<Props> = ({    users, pageInfo, onPageChange, pageSize, getDateRange }) => {

    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
    const end = start + users.length - 1;

    const columns = userReportColumns(getDateRange);

    return (
        <>
            <Table<UserReportI>
                className="custom-table"
                columns={columns}
                dataSource={users}
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

export default UserReportTable;
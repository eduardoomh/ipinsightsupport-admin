import {
    message,
    Table
} from "antd";
import { FC } from "react";
import { UsersI } from "~/features/Users/Interfaces/users.interface";
import { useNavigate } from "@remix-run/react";
import PaginationControls from "~/components/tables/PaginationControls";
import { usersColumns } from "~/features/Users/Tables/userColumns";
import usePagination from "~/hooks/usePagination";
import { DataType } from "~/features/Users/Interfaces/usersTable.interface";
import { PageInfo } from "~/interfaces/pagination.interface";
import { useTableLoading } from "~/hooks/useTableLoading";

interface Props {
    users: UsersI[];
    onDelete?: (id: string) => void;
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
}

const UsersTable: FC<Props> = ({ users, onDelete, pageInfo, onPageChange, pageSize }) => {
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
            message.success("User deleted successfully");
        }
    };
    const { loading, handlePageChange } = useTableLoading(users, onPageChange);
    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
    const end = start + users.length - 1;

    const columns = usersColumns(navigate, handleDelete);

    return (
        <>
            <Table<DataType>
                className="custom-table"
                columns={columns}
                dataSource={users}
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

export default UsersTable;
import {
    message,
    Table
} from "antd";
import { FC } from "react";
import { UsersI } from "~/interfaces/users.interface";
import { useNavigate } from "@remix-run/react";
import PaginationControls from "~/components/tables/PaginationControls";
import { usersColumns } from "./utils/userColumns";
import usePagination from "~/hooks/usePagination";
import { DataType } from "./utils/usersTable.interface";
import { PageInfo } from "~/interfaces/pagination.interface";

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

    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, onPageChange);
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
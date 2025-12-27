import { message, Table } from "antd";
import { FC } from "react";
import { useNavigate } from "@remix-run/react";
import { ContactI } from "~/features/Contacts/Interfaces/contact.interface";
import { PageInfo } from "~/interfaces/pagination.interface";
import { contactColumns } from "~/features/Contacts/Forms/contactColumns";
import usePagination from "~/hooks/usePagination";
import PaginationControls from "~/components/tables/PaginationControls";
import { useTableLoading } from "~/hooks/useTableLoading";

interface DataType {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    contacts: ContactI[];
    onDelete?: (id: string) => void;
    pageInfo: PageInfo;
    onPageChange: (cursor: string, direction: "next" | "prev") => void;
    pageSize: number;
    viewAction?: boolean;
    editActionPath?: string;
}

const ContactsTable: FC<Props> = ({ contacts, onDelete, pageInfo, onPageChange, pageSize, viewAction = true, editActionPath }) => {
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
            message.success("Contact deleted successfully");
        }
    };
    const { loading, handlePageChange } = useTableLoading(contacts, onPageChange);
    const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
    const end = start + contacts.length - 1;

    const columns = contactColumns(navigate, handleDelete, viewAction, editActionPath);

    return (
        <>
            <Table<DataType>
                className="custom-table"
                columns={columns}
                dataSource={contacts}
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

export default ContactsTable;
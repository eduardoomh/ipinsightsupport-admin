import { Button, Table, TableColumnsType } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FC } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/interfaces/clients.interface";

interface DataType {
    name: string;
    email: string;
    phone: string;
    company: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    clients: ClientI[];
    onDelete?: (id: string) => void;
}

const ClientsTable: FC<Props> = ({ clients }) => {

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Phone",
            dataIndex: "phone"
        },
        {
            title: "Company",
            dataIndex: "company"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD"),
        },
        {
            title: "Actions",
            key: "operation",
            fixed: "right",
            width: 150,
            render: (_: any, record: DataType) => (
                <Button icon={<EditOutlined style={{ fontSize: "16px" }} />}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <Table<DataType>
            className="custom-table"
            columns={columns}
            dataSource={clients}
            size="middle"
            rowKey="id"
        />
    );
};

export default ClientsTable;
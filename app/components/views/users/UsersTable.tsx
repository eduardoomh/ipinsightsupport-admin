import { Button, Table, TableColumnsType } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FC } from "react";
import dayjs from "dayjs";
import { UsersI } from "~/interfaces/users.interface";

interface DataType {
    name: string;
    email: string;
    phone: string;
    is_admin: boolean,
    is_active: boolean,
    is_account_manager: boolean,
    createdAt: string;
}

interface Props {
    users: UsersI[];
    onDelete?: (id: string) => void;
}

const UsersTable: FC<Props> = ({ users }) => {

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
            title: "Role",
            dataIndex: "is_admin",
            render: (value: boolean) => `${value ? 'Admin' : 'User'}`
        },
        {
            title: "Status",
            dataIndex: "is_active",
            render: (value: boolean) => `${value ? 'Active' : 'Inactive'}`
        },
        {
            title: "Account",
            dataIndex: "is_account_manager",
            render: (value: boolean) => `${value ? 'Manager' : 'No manager'}`
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
            dataSource={users}
            size="middle"
            rowKey="id"
        />
    );
};

export default UsersTable;
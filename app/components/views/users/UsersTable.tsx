import { Button, message, Popconfirm, Table, TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { FC } from "react";
import dayjs from "dayjs";
import { UsersI } from "~/interfaces/users.interface";
import { useNavigate } from "@remix-run/react";

interface DataType {
    id: string;
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

const UsersTable: FC<Props> = ({ users, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
            message.success("User deleted successfully");
        }
    };

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
                <div className="flex justify-end gap-2">
                    <Button
                        icon={<EyeOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/users/${record.id}/info`)}
                    />
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/users/${record.id}/edit`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
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
            pagination={{ pageSize: 8 }}
        />
    );
};

export default UsersTable;
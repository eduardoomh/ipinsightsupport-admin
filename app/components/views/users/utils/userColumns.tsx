// columns/usersColumns.ts
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import dayjs from "dayjs";
import { DataType } from './usersTable.interface';

export const usersColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void
): TableColumnsType<DataType> => [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Role",
            dataIndex: "is_admin",
            render: (value: boolean) => `${value ? "Admin" : "User"}`,
        },
        {
            title: "Status",
            dataIndex: "is_active",
            render: (value: boolean) => `${value ? "Active" : "Inactive"}`,
        },
        {
            title: "Account",
            dataIndex: "is_account_manager",
            render: (value: boolean) => `${value ? "Manager" : "No manager"}`,
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
            )
        }
    ];
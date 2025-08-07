// columns/usersColumns.ts
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import dayjs from "dayjs";
import { DataType } from './clientsTable.interface';

export const clientColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void
): TableColumnsType<DataType> => [
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
                <div className="flex justify-end gap-2">
                    <Button
                        icon={<EyeOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/clients/${record.id}/info`)}
                    />
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/clients/${record.id}/edit`)}
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
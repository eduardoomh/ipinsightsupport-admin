// columns/usersColumns.ts
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import dayjs from "dayjs";

export const contactColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void,
    viewAction: boolean,
    editActionPath?: string
): TableColumnsType<DataType> => [
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
                    {
                        viewAction && (
                            <Button
                                icon={<EyeOutlined style={{ fontSize: "16px" }} />}
                                onClick={() => navigate(`/admin/advanced/contacts/${record.id}/info`)}
                            />
                        )
                    }
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(editActionPath ? `${editActionPath}/${record.id}` : `/admin/advanced/contacts/${record.id}/edit`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this contact?"
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
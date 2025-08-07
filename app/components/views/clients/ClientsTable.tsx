import { Button, message, Popconfirm, Table, TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { FC } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/interfaces/clients.interface";
import { useNavigate } from "@remix-run/react";

interface DataType {
    id: string;
    company: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    clients: ClientI[];
    onDelete?: (id: string) => void;
}

const ClientsTable: FC<Props> = ({ clients, onDelete }) => {
        const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
            message.success("Client deleted successfully");
        }
    };

    const columns: TableColumnsType<DataType> = [
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

    return (
        <Table<DataType>
            className="custom-table"
            columns={columns}
            dataSource={clients}
            size="middle"
            rowKey="id"
            pagination={{ pageSize: 8 }}
        />
    );
};

export default ClientsTable;
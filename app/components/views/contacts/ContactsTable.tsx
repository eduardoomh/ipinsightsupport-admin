import { Button, message, Popconfirm, Table, TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { FC, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "@remix-run/react";
import { ContactI } from "~/interfaces/contact.interface";

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
}

const ContactsTable: FC<Props> = ({ contacts, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
            message.success("Contact deleted successfully");
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
                        onClick={() => navigate(`/admin/advanced/contacts/${record.id}/info`)}
                    />
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/contacts/${record.id}/edit`)}
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

    return (
        <Table<DataType>
            className="custom-table"
            columns={columns}
            dataSource={contacts}
            size="middle"
            rowKey="id"
            pagination={{ pageSize: 8 }}
        />
    );
};

export default ContactsTable;
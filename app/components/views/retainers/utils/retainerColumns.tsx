// columns/retainerColumns.ts
import { TableColumnsType, Tag } from 'antd';
import dayjs from "dayjs";
import { RetainerType } from './retainers.interface';

export const retainerColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void
): TableColumnsType<RetainerType> => [
        {
            title: "Client",
            dataIndex: ["client", "company"],
            render: (value: string, record: RetainerType) => (
                <a
                    style={{ textDecoration: "underline", color: "black" }}
                    onClick={() => navigate(`/admin/company/dashboard/${record.client.id}`)}>
                    {value}
                </a>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (value: number) => `$${value.toFixed(2)}`,
        },
        {
            title: "Activated On",
            dataIndex: "date_activated",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD"),
        },
        {
            title: "Expires On",
            dataIndex: "date_activated",
            render: (value: string) => dayjs(value).add(1, "year").format("YYYY-MM-DD"),
        },
        {
            title: "Type",
            dataIndex: "is_credit",
            render: (isCredit: boolean) => (
                <Tag color={isCredit ? "green" : "blue"}>
                    {isCredit ? "Credit" : "Debit"}
                </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD"),
        }
    ];
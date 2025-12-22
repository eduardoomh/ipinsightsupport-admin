// columns/retainerColumns.ts
import { TableColumnsType } from 'antd';
import dayjs from "dayjs";
import CompanyLink from '~/components/basics/CompanyLink';
import DateUsFormat from '~/components/tables/DateUsFormat';
import CreditDebitTag from '~/components/basics/CreditDebitCard';
import { BalanceType } from '~/features/Balances/Interfaces/balances.interface';

export const balanceColumns = (): TableColumnsType<BalanceType> => [
        {
            title: "Client",
            dataIndex: ["client", "company"],
            render: (value: string, record: BalanceType) => (
                <CompanyLink company={value} id={record.client.id} />
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
            render: (value: string) =>  <DateUsFormat date={value} />
        },
        {
            title: "Expires On",
            dataIndex: "date_activated",
            render: (value: string) =>  <DateUsFormat date={dayjs(value).add(1, "year").toISOString()} />,
        },
        {
            title: "Type",
            dataIndex: "is_credit",
            render: (isCredit: boolean) => (
                <CreditDebitTag isCredit={isCredit} />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (value: string) =>  <DateUsFormat date={value} />,
        }
    ];
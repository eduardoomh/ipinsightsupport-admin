// columns/usersColumns.ts
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import { DataType } from '~/features/Companies/Tables/AdvancedCompanies/AdvancedCompaniesTable';
import DateUsFormat from '~/components/tables/DateUsFormat';
import CompanyLink from '~/components/basics/CompanyLink';

export const advancedCompaniesColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void,
    baseUrl: string
): TableColumnsType<DataType> => [
        {
            title: "Company",
            dataIndex: "company",
            render: (_: any, record: DataType) => (
                <CompanyLink id={record.id} company={record.company} />
            )
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (value: string) => <DateUsFormat date={value} />,
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
                        onClick={() => navigate(`${baseUrl}/${record.id}/info`)}
                    />
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`${baseUrl}/${record.id}/edit`)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this company?"
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
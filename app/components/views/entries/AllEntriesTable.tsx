import { Button, Table, TableColumnsType, Tooltip } from "antd"
import { EditOutlined } from "@ant-design/icons";

interface DataType {
    key: React.Key;
    billedOn: string;
    client: string;
    hoursBilled: number;
    entrySubmitted: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'BilledOn',
        dataIndex: 'billedOn',
    },
    {
        title: 'Client',
        dataIndex: 'client',
    },
    {
        title: 'Hours Billed',
        dataIndex: 'hoursBilled',
    },
    {
        title: 'Entry Submitted/Updated',
        dataIndex: 'entrySubmitted',
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => (
            <Button icon={<EditOutlined style={{ fontSize: '18px' }} />} >Edit Work Entry</Button>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        billedOn: "12/03/26",
        client: 'John Brown',
        hoursBilled: 32,
        entrySubmitted: 'New York No. 1 Lake Park',

    },
    {
        key: '2',
        billedOn: "12/03/26",
        client: 'Jim Green',
        hoursBilled: 42,
        entrySubmitted: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        billedOn: "12/03/26",
        client: 'Joe Black',
        hoursBilled: 32,
        entrySubmitted: 'Sydney No. 1 Lake Park',
    },
];

const AllEntriesTable = () => {
    return (
        <Table<DataType> className="custom-table" columns={columns} dataSource={data} size="middle" />
    )
}

export default AllEntriesTable
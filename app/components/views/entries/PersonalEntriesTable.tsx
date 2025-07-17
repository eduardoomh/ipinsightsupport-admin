import { Button, Table, TableColumnsType } from "antd"
import { EditOutlined } from "@ant-design/icons";

interface DataType {
    key: React.Key;
    performedOn: string;
    hoursBilled: number;
    entrySubmitted: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Performed On',
        dataIndex: 'performedOn',
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
        performedOn: "12/03/26",
        hoursBilled: 32,
        entrySubmitted: 'New York No. 1 Lake Park',

    },
    {
        key: '2',
        performedOn: "12/03/26",
        hoursBilled: 42,
        entrySubmitted: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        performedOn: "12/03/26",
        hoursBilled: 32,
        entrySubmitted: 'Sydney No. 1 Lake Park',
    },
];

const PersonalEntriesTable = () => {
    return (
        <Table<DataType> className="custom-table" columns={columns} dataSource={data} size="middle" />
    )
}

export default PersonalEntriesTable
import { Button, Table, TableColumnsType } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  billedOn: string;
  client: string;
  hoursBilled: number;
  entrySubmitted: string;
  summary: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Billed On',
    dataIndex: 'billedOn',
  },
  {
    title: 'Client',
    dataIndex: 'client',
  },
  {
    title: 'Hours Billed',
    dataIndex: 'hoursBilled',
    render: (value: number) => (
      <div className="leading-snug">
        <div>{value.toFixed(2)} Hours Billed</div>
        <div>{value.toFixed(2)} Hours Spent</div>
      </div>
    ),
  },
  {
    title: 'Entry Submitted/Updated',
    dataIndex: 'entrySubmitted',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 130,
    render: () => (
      <Button icon={<EditOutlined style={{ fontSize: '18px' }} />}>
        Edit Work Entry
      </Button>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    billedOn: "Apr 18, 2024",
    client: 'Central Florida Electrical Coop',
    hoursBilled: 1,
    entrySubmitted: 'Apr 30, 2024',
    summary: 'Worked on transformer audit.',
  },
  {
    key: '2',
    billedOn: "Apr 12, 2024",
    client: 'Central Florida Electrical Coop',
    hoursBilled: 1,
    entrySubmitted: 'Apr 30, 2024',
    summary: 'Meter replacement coordination.',
  },
  {
    key: '3',
    billedOn: "Mar 18, 2024",
    client: 'Central Florida Electrical Coop',
    hoursBilled: 1,
    entrySubmitted: 'Apr 30, 2024',
    summary: 'Field inspection assistance.',
  },
];

const AllEntriesTable = () => {
  return (
    <Table<DataType>
      className="custom-table"
      columns={columns}
      dataSource={data}
      size="middle"
      rowKey="key"
      expandedRowRender={(record) => (
        <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
          <strong>Summary:</strong> {record.summary}
        </div>
      )}
    />
  );
};

export default AllEntriesTable;
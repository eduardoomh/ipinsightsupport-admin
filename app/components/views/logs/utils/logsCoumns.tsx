import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { LogI } from './logTable.interface';

export const logColumns = (
  navigate: (path: string) => void,
  handleDelete: (id: string) => void,
  viewAction: boolean = true
): TableColumnsType<LogI> => [
  {
    title: "Source",
    dataIndex: "source",
  },
  {
    title: "Level",
    dataIndex: "level",
  },
  {
    title: "Message",
    dataIndex: "message",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "Actions",
    key: "operation",
    fixed: "right",
    width: 120,
    render: (_: any, record: LogI) => (
      <div className="flex justify-end gap-2">
        {viewAction && (
          <Button
            icon={<EyeOutlined style={{ fontSize: "16px" }} />}
            onClick={() => navigate(`/admin/logs/${record.id}`)}
          />
        )}
        <Popconfirm
          title="Are you sure you want to delete this log?"
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
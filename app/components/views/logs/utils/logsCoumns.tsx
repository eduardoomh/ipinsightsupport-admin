import { EyeOutlined } from '@ant-design/icons';
import { TableColumnsType, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { LogI, LogLevel } from './logTable.interface';
import LogLevelTag from '~/components/basics/LogLevelTag';

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
      render: (value: LogLevel) => <LogLevelTag level={value} />
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
              onClick={() => navigate(`/admin/advanced/logs/${record.id}/info`)}
            />
          )}
        </div>
      ),
    },
  ];
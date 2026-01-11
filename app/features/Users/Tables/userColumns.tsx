import { DeleteOutlined, EditOutlined, EyeOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { TableColumnsType, Button, Popconfirm } from 'antd';
import { DataType } from '../Interfaces/usersTable.interface';
import TeamMemberAvatar from '~/components/basics/TeamMemberAvatar';
import DateUsFormat from '~/components/tables/DateUsFormat';

export const usersColumns = (
    navigate: (path: string) => void,
    handleDelete: (id: string) => void
): TableColumnsType<DataType> => [
        {
            title: "Name",
            dataIndex: "name",
            render: (_: any, record: DataType) => (
                <TeamMemberAvatar fullName={record.name} />
            )
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Admin",
            dataIndex: "is_admin",
            render: (value: boolean) =>
                value ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
        },
        {
            title: "Active",
            dataIndex: "is_active",
            render: (value: boolean) =>
                value ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
        },
        {
            title: "Manager",
            dataIndex: "is_account_manager",
            render: (value: boolean) =>
                value ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
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
                        onClick={() => navigate(`/admin/advanced/users/${record.id}/info`)}
                    />
                    <Button
                        icon={<EditOutlined style={{ fontSize: "16px" }} />}
                        onClick={() => navigate(`/admin/advanced/users/${record.id}/edit`)}
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
            )
        }
    ];
// columns/usersColumns.ts
import { Avatar, Space, TableColumnsType, Tag } from 'antd';
import { AdminDataType } from './clientsTable.interface';

export const clientAdminColumns = (
    navigate: (path: string) => void
): TableColumnsType<AdminDataType> => [
        {
            title: "Company",
            dataIndex: "company",
            render: (_, record) => (
                <span
                    style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                    onClick={() => navigate(`/admin/detailed-client/${record.id}`)}
                >
                    {record.company}
                </span>
            ),
        },
        {
            title: "Team",
            dataIndex: "team_members",
            render: (_, record) => {
                if (!record.team_members || record.team_members.length === 0) {
                    return <span> - </span>;
                }

                return (
                    <div>
                        {record.team_members.map((tm, index) => {
                            const name = tm.user?.name || "—";
                            return (
                                <div key={index} style={{ marginBottom: 8 }}>
                                    <Space size="middle">
                                        <Avatar style={{ backgroundColor: "#1890ff" }}>
                                            {name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <span>{name}</span>
                                        {tm.role === "technical_lead" && (
                                            <Tag color="blue">Leading</Tag>
                                        )}
                                    </Space>
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: "Last Work Entry",
            dataIndex: "most_recent_work_entry",
        },
        {
            title: "Most Recent Retainer",
            dataIndex: "most_recent_retainer_activated",
        },
    ];
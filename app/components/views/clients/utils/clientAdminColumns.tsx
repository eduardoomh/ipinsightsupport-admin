// columns/usersColumns.ts
import { Alert, Avatar, Space, TableColumnsType, Tag } from 'antd';
import { AdminDataType } from './clientsTable.interface';
import { getClientStatusLabel } from '~/utils/general/getClientStatusLabel';
import Note from '~/components/basics/Note';

export const clientAdminColumns = (
    navigate: (path: string) => void
): TableColumnsType<AdminDataType> => [
        {
            title: "Company",
            dataIndex: "company",
            render: (_, record) => (
                <>
                    <p
                        style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginBottom: '6px',
                        }}
                        onClick={() => navigate(`/admin/company/dashboard/${record.id}`)}
                    >
                        {record.company}
                    </p>
                    <span>
                        <Tag>{record.timezone}</Tag>
                    </span>
                    <span>
                        <Tag color='blue'>{getClientStatusLabel(record.currentStatus)}</Tag>
                    </span>
                    {
                        record.last_note && (
                            <>
                                <br />
                                <br />
                                <Note note={record.last_note} size="small" />
                            </>
                        )
                    }
                </>
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
                                        <Avatar style={{ backgroundColor: "#01a2ae" }}>
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
            title: "Hours Remaining",
            dataIndex: "estimated_hours",
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: '6px' }}>
                        <Tag>
                            <strong>Engineering:</strong>{" "}
                            {Number(record.estimated_hours.estimated_engineering_hours).toFixed(2)} hours
                        </Tag>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <Tag>
                            <strong>Architecture:</strong>{" "}
                            {Number(record.estimated_hours.estimated_architecture_hours).toFixed(2)} hours
                        </Tag>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <Tag>
                            <strong>Senior Architecture:</strong>{" "}
                            {Number(record.estimated_hours.estimated_senior_architecture_hours).toFixed(2)} hours
                        </Tag>
                    </div >
                </div >
            ),
        },
        {
            title: "Last Work Entry",
            dataIndex: "most_recent_work_entry",
        },
        {
            title: "Most Recent Retainer",
            dataIndex: "most_recent_retainer_activated",
        }
    ];
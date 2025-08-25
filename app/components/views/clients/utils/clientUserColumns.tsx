// columns/usersColumns.ts
import { Avatar, Space, TableColumnsType, Tag } from 'antd';
import { UserDataType } from './clientsTable.interface';
import { getClientStatusLabel } from '~/utils/general/getClientStatusLabel';

export const clientUserColumns = (
    navigate: (path: string) => void
): TableColumnsType<UserDataType> => [
        {
            title: "Company",
            dataIndex: "company",
            render: (_, record) => (
                <span
                    style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                    onClick={() => navigate(`/company/dashboard/${record.id}`)}
                >
                    <p>{record.company}</p>
                    <br />
                    <Tag color='blue'>{getClientStatusLabel(record.currentStatus)}</Tag><Tag>{record.timezone}</Tag>
                </span>
            ),
        },
        {
            title: "Account Manager",
            dataIndex: "account_manager",
            render: (_, record) => {
                if (!record.account_manager) return "No asignado";

                const name = record.account_manager.name;

                return (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}>
                            {name.charAt(0).toUpperCase()}
                        </Avatar>
                        {name}
                    </span>
                );
            },
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
            title: "Remaining hours",
            dataIndex: "estimated_hours",
            render: (_, record) => {

                if (
                    record.estimated_hours.user_estimated_hours === null ||
                    record.estimated_hours.user_rate_type === null
                ) {
                    return (
                        <div>
                            <p style={{ textAlign: 'center' }}>-</p>
                        </div>
                    )
                }

                return (
                    <div>
                        <p style={{ textAlign: 'center' }}>{record.estimated_hours.user_estimated_hours} hrs
                            <br /> <Tag>{record.estimated_hours.user_rate_type}</Tag></p>
                    </div>
                )
            }
        },
        {
            title: "Last Work Entry",
            dataIndex: "most_recent_work_entry",
        }
    ];
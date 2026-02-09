// columns/usersColumns.ts
import { Avatar, Space, TableColumnsType, Tag, Tooltip } from 'antd';
import { UserDataType } from './CompaniesByUserTable';
import { getClientStatusLabel } from '~/utils/general/getClientStatusLabel';
import { getRateTypeLabel } from '~/utils/general/getRateTypeLabel';
import { getTimezoneLabel } from '~/utils/general/getTimezoneLabel';
import CompanyLink from '~/components/basics/CompanyLink';
import TimezoneTag from '~/components/basics/TimezoneTag';
import StatusTag from '~/components/basics/StatusTag';
import HoursTag from '../../Components/HoursTag';
import { ToolOutlined } from '@ant-design/icons';
import { colors, getColorForName } from '~/utils/general/getColorForName';
import TeamMemberAvatar from '~/components/basics/TeamMemberAvatar';
import DateUsFormat from '~/components/tables/DateUsFormat';

export const companiesByUserColumns = (
    navigate: (path: string) => void
): TableColumnsType<UserDataType> => [
        {
            title: "Company",
            dataIndex: "company",
            render: (_, record) => (
                <div
                    style={{
                        border: "1px solid transparent",
                        borderRadius: 8,
                        padding: 12,
                        background: "transparent",
                        marginBottom: 6,
                    }}
                >
                    <CompanyLink company={record.company} id={record.id} isAdmin={false} />

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <TimezoneTag
                            timezone={record.timezone}
                            label={getTimezoneLabel(record.timezone as any)}
                        />

                        <StatusTag status={record.currentStatus} />
                    </div>
                </div>
            ),
        },
        {
            title: "Account Manager",
            dataIndex: "account_manager",
            render: (_, record) => {
                if (!record.account_manager) return "No asignado";

                const name = record.account_manager.name;

                return (
                    <TeamMemberAvatar fullName={name} />
                );
            },
        },
        {
            title: "Team",
            dataIndex: "team_members",
            render: (_, record) => {
                const members = record.team_members;

                if (!members || members.length === 0) {
                    return <span> - </span>;
                }

                if (members.length === 1) {
                    const fullName = members[0].user?.name || "—";

                    return (
                        <TeamMemberAvatar fullName={fullName} />
                    );
                }

                let lastColor = null;

                return (
                    <div style={{ marginTop: 8 }}>
                        <Avatar.Group maxCount={5}>
                            {members.map((tm, index) => {
                                const fullName = tm.user?.name || "—";

                                const initials = fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2);

                                let avatarColor = getColorForName(fullName);

                                // Evitar repetir el mismo color consecutivamente
                                if (avatarColor === lastColor) {
                                    // Elegir el siguiente color disponible
                                    const available = colors.filter((c) => c !== lastColor);
                                    avatarColor = available[index % available.length];
                                }

                                lastColor = avatarColor;

                                return (
                                    <Tooltip key={index} title={fullName}>
                                        <Avatar
                                            size="large"
                                            style={{ backgroundColor: avatarColor }}
                                        >
                                            {initials}
                                        </Avatar>
                                    </Tooltip>
                                );
                            })}
                        </Avatar.Group>
                    </div>
                );
            },
        },
        {
            title: "Remaining hours",
            dataIndex: "estimated_hours",
            render: (_, record) => (

                <Space direction="horizontal" size={12}>
                    <HoursTag
                        label={getRateTypeLabel(record.estimated_hours.user_rate_type as any)}
                        hours={record.estimated_hours.user_estimated_hours}
                        Icon={ToolOutlined}
                    />
                </Space>
            )
        },
        {
            title: "Last Work Entry",
            dataIndex: "most_recent_work_entry",
            render: (date: string) => (
                date !== "—" ? <DateUsFormat date={date} /> : "N/A"
            )
        }
    ];
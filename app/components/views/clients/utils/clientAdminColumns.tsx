// columns/usersColumns.ts
import { Avatar, Space, TableColumnsType, Tooltip } from 'antd';
import { BuildOutlined, SettingOutlined, ShopOutlined, ToolOutlined } from '@ant-design/icons';
import { AdminDataType } from './clientsTable.interface';
import Note from '~/components/basics/Note';
import { getTimezoneLabel } from '~/utils/general/getTimezoneLabel';
import HoursTag from '../components/HoursTag';
import TimezoneTag from '~/components/basics/TimezoneTag';
import StatusTag from '~/components/basics/StatusTag';
import { colors, getColorForName } from '~/utils/general/getColorForName';
import DateUsFormat from '~/components/tables/DateUsFormat';
import CompanyLink from '~/components/basics/CompanyLink';
import TeamMemberAvatar from '~/components/basics/TeamMemberAvatar';

export const clientAdminColumns = (
    navigate: (path: string) => void
): TableColumnsType<AdminDataType> => [
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
                    <CompanyLink company={record.company} id={record.id} />

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <TimezoneTag
                            timezone={record.timezone}
                            label={getTimezoneLabel(record.timezone)}
                        />

                        <StatusTag status={record.currentStatus} />
                    </div>

                    {record.last_note && (
                        <div
                            style={{
                                width: "65%",
                                marginTop: 12,
                            }}
                        >
                            <Note note={record.last_note} size="small" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Team",
            dataIndex: "team_members",
            render: (_, record) => {
                const members = record.team_members;

                if (!members || members.length === 0) {
                    return <span> - </span>;
                }

                // ---- SOLO 1 MIEMBRO ----
                if (members.length === 1) {
                    const fullName = members[0].user?.name || "—";

                    return (
                        <TeamMemberAvatar fullName={fullName} /> 
                    );
                }

                // ---- VARIOS MIEMBROS ----
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
            title: "Hours Remaining",
            dataIndex: "estimated_hours",
            render: (_, record) => (
                <Space direction="horizontal" size={12}>
                    <HoursTag
                        label="Engineering"
                        hours={record.estimated_hours.estimated_engineering_hours}
                        Icon={ToolOutlined}
                    />

                    <HoursTag
                        label="Architecture"
                        hours={record.estimated_hours.estimated_architecture_hours}
                        Icon={BuildOutlined}
                    />

                    <HoursTag
                        label="Senior Architecture"
                        hours={record.estimated_hours.estimated_senior_architecture_hours}
                        Icon={SettingOutlined}
                    />
                </Space>
            ),
        },
        {
            title: "Last Work Entry",
            dataIndex: "most_recent_work_entry",
            render: (date: string) => (
                <DateUsFormat date={date} />
            ),
        },
        {
            title: "Most Recent Balance",
            dataIndex: "most_recent_retainer_activated",
            render: (date: string) => (
                <DateUsFormat date={date} />
            ),
        }
    ];
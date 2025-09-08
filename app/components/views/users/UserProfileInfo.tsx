// UserStats.tsx
import { Descriptions, Tag } from "antd";
import type { UsersI } from "~/interfaces/users.interface";

interface UserStatsProps {
  user: UsersI;
  stats: {
    total_work_entries: number;
    hours_engineering: number;
    hours_architecture: number;
    hours_senior_architecture: number;
  } | null;
  statsLoading: boolean;
}

export const UserProfileInfo = ({ user, stats, statsLoading }: UserStatsProps) => {
  return (
    <Descriptions
      column={1}
      bordered
      size="small"
      layout="horizontal"
      labelStyle={{ width: '33%', fontWeight: 500 }}
      contentStyle={{ width: '66%' }}
      style={{ borderColor: '#d9d9d9' }}
      className="custom-descriptions"
    >
      <Descriptions.Item label="Role">
        {user.is_admin ? <Tag color="red">Admin</Tag> : <Tag color="blue">User</Tag>}
        {user.is_account_manager && <Tag color="purple">Account Manager</Tag>}
      </Descriptions.Item>
      <Descriptions.Item label="Active">
        {user.is_active ? <Tag color="green">Yes</Tag> : <Tag color="volcano">No</Tag>}
      </Descriptions.Item>
      <Descriptions.Item label="Type">{user.type || "-"}</Descriptions.Item>
      <Descriptions.Item label="Total Work Entries">
        {statsLoading ? "Loading..." : `${stats?.total_work_entries ?? 0} (this month)`}
      </Descriptions.Item>
      <Descriptions.Item label="Hours Engineering">
        {statsLoading ? "Loading..." : `${stats?.hours_engineering ?? 0} (this month)`}
      </Descriptions.Item>
      <Descriptions.Item label="Hours Architecture">
        {statsLoading ? "Loading..." : `${stats?.hours_architecture ?? 0} (this month)`}
      </Descriptions.Item>
      <Descriptions.Item label="Hours Senior Architecture">
        {statsLoading ? "Loading..." : `${stats?.hours_senior_architecture ?? 0} (this month)`}
      </Descriptions.Item>
      <Descriptions.Item label="Created At">
        {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Updated At">
        {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
      </Descriptions.Item>
    </Descriptions>
  );
};
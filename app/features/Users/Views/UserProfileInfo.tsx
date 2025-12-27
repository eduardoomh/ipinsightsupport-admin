// UserStats.tsx
import { MailOutlined } from "@ant-design/icons";
import { Descriptions, Tag, Alert, Button, message } from "antd";
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import type { UsersI } from "~/features/Users/Interfaces/users.interface";

interface UserStatsProps {
  user: UsersI;
  stats: {
    total_work_entries: number;
    hours_engineering: number;
    hours_architecture: number;
    hours_senior_architecture: number;
  } | null;
  statsLoading: boolean;
  hasNotPassword?: boolean;
}

// Tipado del fetcher.data esperado
interface ResendPasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export const UserProfileInfo = ({
  user,
  stats,
  statsLoading,
  hasNotPassword,
}: UserStatsProps) => {
  const fetcher = useFetcher<ResendPasswordResponse>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        message.success(fetcher.data.message || "Password setup email resent successfully.");
      } else if (fetcher.data.error) {
        message.error(fetcher.data.error || "Failed to resend password setup email.");
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div>
      {hasNotPassword && (
        <Alert
          message="This user has not configured their password yet."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Descriptions
        column={1}
        bordered
        size="small"
        layout="horizontal"
        labelStyle={{ width: "33%", fontWeight: 500 }}
        contentStyle={{ width: "66%" }}
        style={{ borderColor: "#d9d9d9" }}
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
        <Descriptions.Item label="Last Login">
          {user.updatedAt ? new Date(user.last_login ? user.last_login : user.updatedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>

      {hasNotPassword && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <fetcher.Form method="post" action={`/api/users/${user.id}/resend-password`}>
            <Button
              type="primary"
              icon={<MailOutlined />}
              htmlType="submit"
              loading={fetcher.state !== "idle"}
            >
              Resend password setup email
            </Button>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
};
// ContactProfileInfo.tsx
import { Descriptions, Button, message, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { ContactI } from "~/features/Contacts/Interfaces/contact.interface";

interface ContactProfileInfoProps {
  contact: ContactI;
  hasNotPassword?: boolean;
}

interface SendWelcomeResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export const ContactProfileInfo = ({ contact, hasNotPassword = false }: ContactProfileInfoProps) => {
  const fetcher = useFetcher<SendWelcomeResponse>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        message.success(fetcher.data.message || "Welcome email sent successfully.");
      } else if (fetcher.data.error) {
        message.error(fetcher.data.error || "Failed to send welcome email.");
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div>
      {hasNotPassword && (
        <Alert
          message="This contact has not configured their password yet."
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
        <Descriptions.Item label="Phone">{contact.phone || "-"}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>

      {hasNotPassword && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <fetcher.Form method="post" action={`/api/contacts/${contact.id}/resend-password`}>
            <Button
              type="primary"
              icon={<MailOutlined />}
              htmlType="submit"
              loading={fetcher.state !== "idle"}
            >
              Send welcome email
            </Button>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
};
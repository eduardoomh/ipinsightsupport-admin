// ContactProfileInfo.tsx
import { Descriptions, Tag } from "antd";
import type { ContactI } from "~/interfaces/contact.interface";

interface ContactProfileInfoProps {
  contact: ContactI;
}

export const ContactProfileInfo = ({ contact }: ContactProfileInfoProps) => {
  return (
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
  );
};
import { Divider, Skeleton, Card, Avatar } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { ContactCard } from "~/components/basics/ContactCard";
import { ContactProfileInfo } from "~/features/Contacts/Views/ContactProfileInfo";
import type { ContactI } from "~/features/Contacts/Interfaces/contact.interface";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

interface Props {
  contact: ContactI | null;
  loading: boolean;
  onCompanyClick: (clientId: string) => void;
}

export function ContactInfoContent({ contact, loading, onCompanyClick }: Props) {
  if (loading) {
    return (
      <div className="p-4">
        <Card bordered className="mb-6" style={{ borderColor: "#d9d9d9" }}>
          <Skeleton.Avatar active size={60} shape="circle" className="mb-4" />
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
        <Card bordered style={{ borderColor: "#d9d9d9" }}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  if (!contact) return <div className="text-center text-red-500">Contact not found</div>;

  return (
    <div className="p-4">
      <ContactCard contact={contact} />
      <ContactProfileInfo contact={contact} hasNotPassword={!contact.has_password} />

      {contact.client && (
        <>
          <Divider />
          <h2 className="text-l font-semibold mb-4">Related Company</h2>
          <div
            className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onCompanyClick(contact.client.id)}
          >
            <Avatar size={40} icon={<ShopOutlined />} style={{ backgroundColor: "#096584" }} />
            <div>
              <p className="font-medium">{contact.client.company}</p>
              <p className="text-sm text-gray-500">
                {getClientStatusLabel(contact.client.currentStatus as any)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
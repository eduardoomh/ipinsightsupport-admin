import { Divider, Skeleton, Avatar } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import { CompanyCard } from "~/components/basics/CompanyCard";
import { CompanyProfileInfo } from "~/features/Companies/Views/CompanyProfileInfo";
import type { ClientI } from "~/interfaces/clients.interface";

interface Props {
  client: ClientI | null;
  loading: boolean;
  onContactClick: (id: string) => void;
}

export function CompanyDetailsContent({ client, loading, onContactClick }: Props) {
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (!client) return <div className="text-center text-red-500">Company not found</div>;

  return (
    <div className="p-4">
      <CompanyCard company={client} />
      <CompanyProfileInfo company={client} />

      {Array.isArray(client.contacts) && client.contacts.length > 0 && (
        <>
          <Divider />
          <h2 className="text-l font-semibold mb-4">Contacts</h2>
          <div className="flex flex-col gap-2">
            {client.contacts.map((contact: any) => (
              <div
                key={contact.id}
                className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onContactClick(contact.id)}
              >
                <Avatar size={40} icon={<IdcardOutlined />} style={{ backgroundColor: "#FFA500" }} />
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
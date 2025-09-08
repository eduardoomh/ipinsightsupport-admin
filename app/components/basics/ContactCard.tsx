// AvatarCard.tsx
import { Avatar, Card } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import { ContactI } from "~/interfaces/contact.interface";

interface AvatarCardProps {
  contact: ContactI;
}

export const ContactCard = ({ contact }: AvatarCardProps) => {
  return (
    <Card className="mb-6" bordered style={{ borderColor: '#d9d9d9' }}>
      <div className="flex items-center gap-4">
        <Avatar
          size={60}
          icon={ <IdcardOutlined />}
          className="bg-[#FFA500] text-white"
        >
          {contact.name?.charAt(0)}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{contact.name}</h2>
          <p className="text-gray-600">{contact.email}</p>
        </div>
      </div>
    </Card>
  );
};
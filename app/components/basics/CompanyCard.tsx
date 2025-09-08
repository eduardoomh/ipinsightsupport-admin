// AvatarCard.tsx
import { Avatar, Card } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { ClientI } from "~/interfaces/clients.interface";

interface AvatarCardProps {
  company: ClientI;
}

export const CompanyCard = ({ company }: AvatarCardProps) => {
  return (
    <Card className="mb-6" bordered style={{ borderColor: '#d9d9d9' }}>
      <div className="flex items-center gap-4">
        <Avatar
          size={60}
          icon={ <ShopOutlined />}
          className="bg-[#096584] text-white"
        >
          {company.company?.charAt(0)}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{company.company}</h2>
        </div>
      </div>
    </Card>
  );
};
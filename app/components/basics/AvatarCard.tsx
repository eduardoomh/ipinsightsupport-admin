// AvatarCard.tsx
import { Avatar, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { UsersI } from "~/features/Users/Interfaces/users.interface";

interface AvatarCardProps {
  user: UsersI;
}

export const AvatarCard = ({ user }: AvatarCardProps) => {
  return (
    <Card className="mb-6" bordered style={{ borderColor: '#d9d9d9' }}>
      <div className="flex items-center gap-4">
        <Avatar
          size={60}
          src={user.avatar || undefined}
          icon={!user.avatar && <UserOutlined />}
          className="bg-[#00a2ae] text-white"
        >
          {!user.avatar && user.name?.charAt(0)}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </Card>
  );
};
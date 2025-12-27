import { Skeleton } from "antd";
import { AvatarCard } from "~/components/basics/AvatarCard";
import { UserProfileInfo } from "~/features/Users/Views/UserProfileInfo";
import type { UsersI } from "~/features/Users/Interfaces/users.interface";

interface Props {
  user: UsersI | null;
  stats: any;
  loading: boolean;
  statsLoading: boolean;
}

export function UserInfoContent({ user, stats, loading, statsLoading }: Props) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Skeleton.Avatar size={60} active />
        <Skeleton paragraph={{ rows: 6 }} active />
      </div>
    );
  }

  if (!user) return <div className="text-center text-red-500">User not found</div>;

  return (
    <>
      <AvatarCard user={user} />
      <UserProfileInfo 
        user={user} 
        stats={stats} 
        statsLoading={statsLoading} 
        hasNotPassword={!user.has_password} 
      />
    </>
  );
}
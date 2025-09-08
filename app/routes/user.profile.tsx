import { LoaderFunction, redirect } from "@remix-run/node";
import { message, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import { AvatarCard } from "~/components/basics/AvatarCard";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { UserProfileInfo } from "~/components/views/users/UserProfileInfo";
import { UserContext } from "~/context/UserContext";
import { UsersI } from "~/interfaces/users.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

interface UserStatsI {
  total_work_entries: number;
  hours_engineering: number;
  hours_architecture: number;
  hours_senior_architecture: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);

  if (!session) {
    return redirect("/login");
  }

  return null;
};

export default function UserProfile() {
  const userData = useContext(UserContext);
  const [user, setUser] = useState<UsersI | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<UserStatsI | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userData.id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await fetch(`/api/user-stats?user_id=${userData.id}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      if (data.userStats && data.userStats.length > 0) {
        const latest = data.userStats[0];
        setStats({
          total_work_entries: latest.total_work_entries,
          hours_engineering: latest.hours_engineering,
          hours_architecture: latest.hours_architecture,
          hours_senior_architecture: latest.hours_senior_architecture,
        });
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load user stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchUser();
      fetchUserStats();
    }
  }, [userData?.id]);

  return (
    <DashboardLayout title="Profile">
      {(loading || statsLoading) ? (
        <div className="py-8">
          <Skeleton.Avatar size={80} active className="mb-4" />
          <Skeleton paragraph={{ rows: 6 }} active />
        </div>
      ) : user ? (
        <>
          <AvatarCard user={user} />
          <UserProfileInfo user={user} stats={stats} statsLoading={statsLoading} />
        </>
      ) : (
        <div className="text-center text-red-500 py-8">User not found</div>
      )}
    </DashboardLayout>
  );
}
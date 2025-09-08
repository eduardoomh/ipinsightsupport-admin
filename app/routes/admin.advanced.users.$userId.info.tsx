// InfoUserModal.tsx
import { useNavigate, useParams } from "@remix-run/react";
import { Modal, message, Skeleton } from "antd";
import { useEffect, useState } from "react";
import type { UsersI } from "~/interfaces/users.interface";
import { UserProfileInfo } from "~/components/views/users/UserProfileInfo";
import { AvatarCard } from "~/components/basics/AvatarCard";

interface UserStatsI {
  total_work_entries: number;
  hours_engineering: number;
  hours_architecture: number;
  hours_senior_architecture: number;
}

export default function InfoUserModal() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UsersI | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<UserStatsI | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch {
      message.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await fetch(`/api/user-stats?user_id=${userId}`);
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
    } catch {
      message.error("Failed to load user stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserStats();
  }, [userId]);

  const handleClose = () => navigate("/admin/advanced/users");

  return (
    <Modal
      title="Profile"
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      {loading ? (
        <div className="text-center py-8">
          <Skeleton.Avatar size={60} active />
          <Skeleton paragraph={{ rows: 6 }} active />
        </div>
      ) : user ? (
        <>
          <AvatarCard user={user} />
          <UserProfileInfo user={user} stats={stats} statsLoading={statsLoading} />
        </>
      ) : (
        <div className="text-center text-red-500">User not found</div>
      )}
    </Modal>
  );
}
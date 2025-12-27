import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { UsersI } from "~/features/Users/Interfaces/users.interface";

interface UserStatsI {
  total_work_entries: number;
  hours_engineering: number;
  hours_architecture: number;
  hours_senior_architecture: number;
}

export function useUserInfo(userId: string | undefined) {
  const [user, setUser] = useState<UsersI | null>(null);
  const [stats, setStats] = useState<UserStatsI | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    // Fetch User
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch {
      message.error("Failed to load user data");
    } finally {
      setLoading(false);
    }

    // Fetch Stats
    try {
      const res = await fetch(`/api/user-stats?user_id=${userId}`);
      const data = await res.json();
      if (data.userStats?.length > 0) {
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
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { user, stats, loading, statsLoading };
}
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { UsersI } from "~/features/Users/Interfaces/users.interface";

export function useEditUser(userId: string | undefined, onSuccess: () => void) {
  const [user, setUser] = useState<UsersI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos del usuario
  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUser(data);
    } catch (err) {
      message.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Actualizar datos del usuario
  const updateUser = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("User updated successfully");
        onSuccess();
      } else {
        message.error("Error updating user");
      }
    } catch (err) {
      message.error("Error updating user");
    } finally {
      setSubmitting(false);
    }
  };

  return { user, loading, submitting, updateUser };
}
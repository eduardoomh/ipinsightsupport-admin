// ~/features/WorkEntries/Hooks/useCreateWorkEntry.ts
import { useState, useEffect } from "react";
import { message } from "antd";

export function useCreateWorkEntry(companyId: string, onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  // Carga de usuarios para el select del formulario
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users?take=100&fields=id,name");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    fetchUsers();
  }, []);

  const createWorkEntry = async (values: any) => {
    setSubmitting(true);
    try {
      const workEntryFormData = new FormData();
      const workEntryPayload = {
        ...values,
        client_id: companyId,
      };

      workEntryFormData.append("workEntry", JSON.stringify(workEntryPayload));

      const res = await fetch("/api/work-entries", {
        method: "POST",
        body: workEntryFormData,
      });

      if (!res.ok) throw new Error("Failed to create Work entry");

      message.success("Work entry created successfully");
      onSuccess(); // Refrescar y cerrar
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { createWorkEntry, submitting, users };
}
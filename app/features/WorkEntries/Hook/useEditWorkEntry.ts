// ~/features/WorkEntries/Hooks/useEditWorkEntry.ts
import { useState, useEffect } from "react";
import { message } from "antd";
import { WorkEntry } from "../Interfaces/workEntries.interface";

export function useEditWorkEntry(entryId: string | undefined, onSuccess: () => void) {
  const [entry, setEntry] = useState<WorkEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar la entrada existente
  useEffect(() => {
    if (!entryId) return;

    const fetchEntry = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/work-entries/${entryId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEntry(data);
      } catch (err) {
        message.error("Failed to load work entry data");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId]);

  const updateWorkEntry = async (values: any) => {
    if (!entry) return;
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      // Reconstruimos el payload con IDs necesarios
      const payload = {
        ...values,
        user_id: entry.user?.id,
        client_id: entry.client?.id
      };

      formData.append("entry", JSON.stringify(payload));

      const res = await fetch(`/api/work-entries/${entryId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error();

      message.success("Work entry updated successfully");
      onSuccess();
    } catch (err) {
      message.error("Error updating Work entry");
    } finally {
      setSubmitting(false);
    }
  };

  return { entry, loading, submitting, updateWorkEntry };
}
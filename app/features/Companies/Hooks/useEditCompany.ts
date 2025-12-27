import { useState, useEffect } from "react";
import { message } from "antd";
import type { ClientI } from "~/features/Companies/Interfaces/clients.interface";

export function useEditCompany(clientId: string | undefined, onSuccess: () => void) {
  const [client, setClient] = useState<ClientI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/clients/${clientId}`)
      .then((res) => res.json())
      .then((data) => setClient(data))
      .catch(() => message.error("Failed to load company data"))
      .finally(() => setLoading(false));
  }, [clientId]);

  // Enviar datos
  const updateClient = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("client", JSON.stringify(values));

      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("Company updated successfully");
        onSuccess();
      } else {
        message.error("Error updating company");
      }
    } catch (err) {
      message.error("Error updating company");
    } finally {
      setSubmitting(false);
    }
  };

  return { client, loading, submitting, updateClient };
}
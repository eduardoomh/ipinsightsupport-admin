import { useState, useEffect } from "react";
import { message } from "antd";
import type { ClientI } from "~/features/Companies/Interfaces/clients.interface";

export function useCompanyDetails(clientId: string | undefined) {
  const [client, setClient] = useState<ClientI | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/clients/${clientId}`);
      const data = await res.json();
      setClient(data);
    } catch (err) {
      message.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  return { client, loading };
}
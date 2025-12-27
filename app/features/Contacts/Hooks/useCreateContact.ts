import { useState, useEffect } from "react";
import { message } from "antd";

export function useCreateContact(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<{ id: string; company: string }[]>([]);

  // Cargar lista de clientes para el selector
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data.clients))
      .catch(() => message.error("Failed to load clients"));
  }, []);

  const createContact = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        client_id: values.client_id || null,
      };

      const contactFormData = new FormData();
      contactFormData.append("contact", JSON.stringify(payload));

      const contactRes = await fetch("/api/contacts", {
        method: "POST",
        body: contactFormData,
      });

      if (!contactRes.ok) throw new Error("Failed to create contact");

      message.success("Contact created successfully.");
      onSuccess();
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { clients, submitting, createContact };
}
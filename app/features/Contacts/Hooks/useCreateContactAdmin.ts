// ~/features/Contacts/Hooks/useCreateContact.ts
import { useState, useEffect } from "react";
import { message } from "antd";

export function useCreateContactAdmin(companyId: string, onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<{ id: string; company: string }[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients?take=1000&fields=id,company");
        const data = await res.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error("Failed to load clients", error);
      }
    };
    fetchClients();
  }, []);

  const createContact = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        client_id: companyId,
      };

      const contactFormData = new FormData();
      contactFormData.append("contact", JSON.stringify(payload));

      const res = await fetch("/api/contacts", {
        method: "POST",
        body: contactFormData,
      });

      if (!res.ok) throw new Error("Failed to create contact");

      message.success("Contact created successfully. Email sent for password setup.");
      onSuccess();
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { createContact, submitting, clients };
}
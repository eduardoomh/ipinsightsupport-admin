import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { ContactI } from "~/features/Contacts/Interfaces/contact.interface";

export function useEditContact(contactId: string | undefined, onSuccess: () => void) {
  const [contact, setContact] = useState<ContactI | null>(null);
  const [clients, setClients] = useState<{ id: string; company: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Carga inicial: Datos del contacto y lista de clientes
  const fetchData = useCallback(async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const [contactRes, clientsRes] = await Promise.all([
        fetch(`/api/contacts/${contactId}`),
        fetch("/api/clients")
      ]);

      const contactData = await contactRes.json();
      const clientsData = await clientsRes.json();

      setContact(contactData);
      setClients(clientsData.clients || []);
    } catch (err) {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Proceso de actualización
  const updateContact = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("contact", JSON.stringify(values));

      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("Contact updated successfully");
        onSuccess();
      } else {
        message.error("Error updating contact");
      }
    } catch (err) {
      message.error("Error updating contact");
    } finally {
      setSubmitting(false);
    }
  };

  return { contact, clients, loading, submitting, updateContact };
}
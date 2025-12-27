import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { ContactI } from "~/features/Contacts/Interfaces/contact.interface";

export function useContactInfo(contactId: string | undefined) {
  const [contact, setContact] = useState<ContactI | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContact = useCallback(async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts/${contactId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContact(data);
    } catch (err) {
      message.error("Failed to load contact data");
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return { contact, loading };
}
import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer, message } from "antd";
import { useEffect, useState } from "react";
import ContactForm from "~/components/views/contacts/ContactForm";
import { ContactI } from "~/interfaces/contact.interface";

type OutletContext = {
  refreshContacts: () => void;
};

export default function EditContactDrawer() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { refreshContacts } = useOutletContext<OutletContext>();
  const [contact, setContact] = useState<ContactI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<{ id: string; company: string }[]>([]);

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`);
      const data = await res.json();
      setContact(data);
    } catch (err) {
      message.error("Failed to load contact data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [contactId]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data.clients);
      } catch (error) {
        console.error("Failed to load clients");
      }
    };

    fetchClients();
  }, []);

  const handleClose = () => navigate("/admin/advanced/contacts");

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = { ...values };
      const contactFormData = new FormData();
      contactFormData.append("contact", JSON.stringify(payload));

      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        body: contactFormData,
      });

      if (res.ok) {
        message.success("Contact updated successfully");
        refreshContacts();
        handleClose();
      } else {
        message.error("Error updating contact");
      }
    } catch (err) {
      message.error("Error updating contact");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Edit Contact"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      {loading ? (
        <div className="text-center py-8">Loading contact data...</div>
      ) : (
        <ContactForm
          contact={contact}
          handleSubmit={handleSubmit}
          submitting={submitting}
          clients={clients}
          edit={true}
        />
      )}
    </Drawer>
  );
}
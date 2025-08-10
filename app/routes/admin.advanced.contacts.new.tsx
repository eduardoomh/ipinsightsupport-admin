import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useEffect, useState } from "react";
import ContactForm from "~/components/views/contacts/ContactForm";

export default function NewContactDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<{ refreshResults: () => void }>();
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<{ id: string; company: string }[]>([]);

  const handleClose = () => navigate("/admin/advanced/contacts");

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

  const handleSubmit = async (values: any) => {
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

      if (!contactRes.ok) {
        throw new Error("Failed to create contact");
      }

      message.success("Contact created successfully");
      refreshResults();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Create New Contact"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      <ContactForm
        contact={null}
        handleSubmit={handleSubmit}
        submitting={submitting}
        clients={clients}
        edit={false}
      />
    </Drawer>
  );
}
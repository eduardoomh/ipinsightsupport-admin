// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useState } from "react";
import ClientForm from "~/components/views/clients/ClientsForm";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<{ refreshResults: () => void }>();
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => navigate("/admin/advanced/companies");

  const handleSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      // 1. Crear el cliente
      const clientFormData = new FormData();
      const clientPayload = {
        company: values.company,
        timezone: getTimezoneLabel(values.timezone as any),
      };
      clientFormData.append("client", JSON.stringify(clientPayload));

      const clientRes = await fetch("/api/clients", {
        method: "POST",
        body: clientFormData,
      });

      if (!clientRes.ok) {
        throw new Error("Failed to create company");
      }

      const savedClient = await clientRes.json();

      // 2. Crear el contacto asociado
      const contactFormData = new FormData();
      const contactPayload = {
        name: values.contact.name,
        email: values.contact.email,
        phone: values.contact.phone,
        client_id: savedClient.id,
      };
      contactFormData.append("contact", JSON.stringify(contactPayload));

      const contactRes = await fetch("/api/contacts", {
        method: "POST",
        body: contactFormData,
      });

      if (!contactRes.ok) {
        throw new Error("Failed to create contact");
      }

      message.success("Company and contact created successfully. An email has been sent to the contact to set their password.");
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
      title="Create New Company"
      open={true}
      onClose={handleClose}
      footer={null}
      width={720}
      destroyOnClose
      placement="right"
    >
      <ClientForm
        client={null}
        handleSubmit={handleSubmit}
        submitting={submitting}
        edit={false}
      />
    </Drawer>
  );
}
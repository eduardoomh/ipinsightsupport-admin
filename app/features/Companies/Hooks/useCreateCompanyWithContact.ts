import { useState } from "react";
import { message } from "antd";

export function useCreateCompanyWithContact(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);

  const createFlow = async (values: any) => {
    setSubmitting(true);
    try {
      // 1. Crear el cliente
      const clientFormData = new FormData();
      clientFormData.append("client", JSON.stringify({
        company: values.company,
        timezone: values.timezone,
      }));

      const clientRes = await fetch("/api/clients", { method: "POST", body: clientFormData });
      if (!clientRes.ok) throw new Error("Failed to create company");
      const savedClient = await clientRes.json();

      // 2. Crear el contacto asociado
      const contactFormData = new FormData();
      contactFormData.append("contact", JSON.stringify({
        ...values.contact,
        client_id: savedClient.id,
      }));

      const contactRes = await fetch("/api/contacts", { method: "POST", body: contactFormData });
      if (!contactRes.ok) throw new Error("Failed to create contact");

      message.success("Company and contact created successfully.");
      onSuccess();
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, createFlow };
}
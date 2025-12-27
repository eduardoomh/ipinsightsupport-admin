import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import ContactForm from "~/features/Contacts/Forms/ContactForm";
import { useCreateContact } from "~/features/Contacts/Hooks/useCreateContact";

export default function NewContactDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<{ refreshResults: () => void }>();

  const handleClose = () => navigate("/admin/advanced/contacts");

  const { clients, submitting, createContact } = useCreateContact(() => {
    refreshResults();
    handleClose();
  });

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
        handleSubmit={createContact}
        submitting={submitting}
        clients={clients}
        edit={false}
      />
    </Drawer>
  );
}
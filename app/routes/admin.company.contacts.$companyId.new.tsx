// routes/admin/advanced/contacts/$companyId.new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import ContactForm from "~/features/Contacts/Forms/ContactForm";
import { useCreateContactAdmin } from "~/features/Contacts/Hooks/useCreateContactAdmin";

export default function NewContactDrawerRoute() {
  const navigate = useNavigate();
  
  const { refreshResults, company } = useOutletContext<{ refreshResults: () => void, company: any }>();
  const handleClose = () => navigate(`/admin/company/contacts/${company?.id}`);

  const { createContact, submitting, clients } = useCreateContactAdmin(
    company?.id,
    () => {
      refreshResults();
      handleClose();
    }
  );

  if (!company) return null;

  return (
    <Drawer
      title={`Create New Contact for ${company.company}`}
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
        excludeClientField={true}
        edit={false}
      />
    </Drawer>
  );
}
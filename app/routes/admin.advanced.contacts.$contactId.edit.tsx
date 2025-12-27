import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer } from "antd";
import ContactForm from "~/features/Contacts/Forms/ContactForm";
import { useEditContact } from "~/features/Contacts/Hooks/useEditContact";

type OutletContext = { refreshResults: () => void };

export default function EditContactDrawer() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<OutletContext>();

  const handleClose = () => navigate("/admin/advanced/contacts");

  const { contact, clients, loading, submitting, updateContact } = useEditContact(
    contactId, 
    () => {
      refreshResults();
      handleClose();
    }
  );

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
          handleSubmit={updateContact}
          submitting={submitting}
          clients={clients}
          edit={true}
        />
      )}
    </Drawer>
  );
}
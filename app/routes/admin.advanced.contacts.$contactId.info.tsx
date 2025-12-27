import { useNavigate, useParams } from "@remix-run/react";
import { Modal } from "antd";
import { useContactInfo } from "~/features/Contacts/Hooks/useContactInfo";
import { ContactInfoContent } from "~/features/Contacts/Components/ContactInfoContent";

export default function InfoContactModal() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { contact, loading } = useContactInfo(contactId);

  const handleClose = () => navigate("/admin/advanced/contacts");
  const handleCompanyClick = (id: string) => navigate(`/admin/company/dashboard/${id}`);

  return (
    <Modal
      title="Contact Info"
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <ContactInfoContent 
        contact={contact} 
        loading={loading} 
        onCompanyClick={handleCompanyClick} 
      />
    </Modal>
  );
}
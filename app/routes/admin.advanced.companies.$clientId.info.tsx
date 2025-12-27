import { useNavigate, useParams } from "@remix-run/react";
import { Modal } from "antd";
import { CompanyDetailsContent } from "~/features/Companies/Components/CompanyDetailsContent";
import { useCompanyDetails } from "~/features/Companies/Hooks/useCompanyDetails";

export default function InfoClientModal() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { client, loading } = useCompanyDetails(clientId);

  const handleClose = () => navigate("/admin/advanced/companies");
  const handleContactClick = (id: string) => navigate(`/admin/advanced/contacts/${id}/info`);

  return (
    <Modal
      title="Company info"
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <CompanyDetailsContent 
        client={client} 
        loading={loading} 
        onContactClick={handleContactClick} 
      />
    </Modal>
  );
}
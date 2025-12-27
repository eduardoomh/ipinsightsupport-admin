import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer } from "antd";
import FormSkeleton from "~/components/basics/FormSkeleton";
import AdvancedCompanyForm from "~/features/Companies/Forms/AdvancedCompanyForm";
import { useEditCompany } from "~/features/Companies/Hooks/useEditCompany";

type OutletContext = { refreshResults: () => void };

export default function EditClientDrawer() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<OutletContext>();

  const handleClose = () => navigate("/admin/advanced/companies");

  const { client, loading, submitting, updateClient } = useEditCompany(clientId, () => {
    refreshResults();
    handleClose();
  });

  return (
    <Drawer
      title="Edit Company"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      {loading ? (
        <FormSkeleton />
      ) : (
        <AdvancedCompanyForm
          client={client}
          handleSubmit={updateClient}
          submitting={submitting}
          edit={true}
        />
      )}
    </Drawer>
  );
}
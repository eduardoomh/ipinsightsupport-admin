// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import AdvancedCompanyForm from "~/features/Companies/Forms/AdvancedCompanyForm";
import { useCreateCompanyWithContact } from "~/features/Companies/Hooks/useCreateCompanyWithContact";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<{ refreshResults: () => void }>();

  const handleClose = () => navigate("/admin/advanced/companies");

  const { submitting, createFlow } = useCreateCompanyWithContact(() => {
    refreshResults();
    handleClose();
  });

  return (
    <Drawer
      title="Create New Company"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      <AdvancedCompanyForm
        client={null}
        handleSubmit={createFlow}
        submitting={submitting}
        edit={false}
      />
    </Drawer>
  );
}
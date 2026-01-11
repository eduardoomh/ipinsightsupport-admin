// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import WorkEntryForm from "~/features/WorkEntries/Forms/WorkEntriesForm";
import { useCreateWorkEntry } from "~/features/WorkEntries/Hook/useCreateWorkEntry";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults, company } = useOutletContext<{ refreshResults: () => void, company: any }>();

  if (!company) return null;

  const handleClose = () => navigate(`/admin/company/work-entries/${company.id}`);

  const { createWorkEntry, submitting, users } = useCreateWorkEntry(
    company.id, 
    () => {
      refreshResults();
      handleClose();
    }
  );

  return (
    <Drawer
      title="Create New Work entry"
      open={true}
      onClose={handleClose}
      footer={null}
      width={720}
      destroyOnClose
      placement="right"
    >
      <WorkEntryForm
        handleSubmit={createWorkEntry}
        submitting={submitting}
        users={users}
        company={company}
      />
    </Drawer>
  );
}
// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import UsersForm from "~/features/Users/Forms/UsersForm";
import { useCreateUser } from "~/features/Users/Hooks/useCreateUser";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<{ refreshResults: () => void }>();

  const handleClose = () => navigate("/admin/advanced/users");

  const { submitting, createUser } = useCreateUser(() => {
    refreshResults();
    handleClose();
  });

  return (
    <Drawer
      title="Create New User"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      <UsersForm
        user={null}
        handleSubmit={createUser}
        submitting={submitting}
        edit={false}
      />
    </Drawer>
  );
}
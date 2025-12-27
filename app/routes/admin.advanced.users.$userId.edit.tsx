import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer } from "antd";
import UsersForm from "~/features/Users/Forms/UsersForm";
import { useEditUser } from "~/features/Users/Hooks/useEditUser";

type OutletContext = { refreshResults: () => void };

export default function EditUserDrawer() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<OutletContext>();

  const handleClose = () => navigate("/admin/advanced/users");

  const { user, loading, submitting, updateUser } = useEditUser(userId, () => {
    refreshResults();
    handleClose();
  });

  return (
    <Drawer
      title="Edit User"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      {loading ? (
        <div className="text-center py-8">Loading user data...</div>
      ) : (
        <UsersForm
          user={user}
          handleSubmit={updateUser}
          submitting={submitting}
          edit={true}
        />
      )}
    </Drawer>
  );
}
// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useState } from "react";
import UsersForm from "~/components/views/users/UsersForm";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshUsers } = useOutletContext<{ refreshUsers: () => void }>();
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => navigate("/admin/advanced/users");

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));

      const res = await fetch(`/api/users`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        message.success("User created successfully");
        refreshUsers();
        handleClose();
      } else {
        message.error("Error creating user");
      }
    } catch (err) {
      message.error("Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

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
        handleSubmit={handleSubmit}
        submitting={submitting}
        edit={false}
      />
    </Drawer>
  );
}
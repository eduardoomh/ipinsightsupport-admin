// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useState } from "react";
import ClientForm from "~/components/views/clients/ClientsForm";

export default function NewUserDrawerRoute() {
  const navigate = useNavigate();
  const { refreshClients } = useOutletContext<{ refreshClients: () => void }>();
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => navigate("/");

  return (
    <Drawer
      title="Create New Retainer"
      open={true}
      onClose={handleClose}
      footer={null}
      width={720}
      destroyOnClose
      placement="right"
    >
      <p>form</p>
    </Drawer>
  );
}
import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer, message } from "antd";
import { useEffect, useState } from "react";
import UsersForm from "~/components/views/users/UsersForm";
import type { UsersI } from "~/interfaces/users.interface";

type OutletContext = {
  refreshResults: () => void;
};

export default function EditUserDrawer() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<OutletContext>();
  const [user, setUser] = useState<UsersI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (err) {
      message.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleClose = () => navigate("/admin/advanced/users");

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("User updated successfully");
        refreshResults();
        handleClose();
      } else {
        message.error("Error updating user");
      }
    } catch (err) {
      message.error("Error updating user");
    } finally {
      setSubmitting(false);
    }
  };

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
          handleSubmit={handleSubmit}
          submitting={submitting}
          edit={true}
        />
      )}
    </Drawer>
  );
}
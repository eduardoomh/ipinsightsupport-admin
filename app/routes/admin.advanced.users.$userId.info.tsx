// InfoUserModal.tsx
import { useNavigate, useParams } from "@remix-run/react";
import { Modal } from "antd";
import { useUserInfo } from "~/features/Users/Hooks/useUserInfo";
import { UserInfoContent } from "~/features/Users/Components/UserInfoContent";

export default function InfoUserModal() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, stats, loading, statsLoading } = useUserInfo(userId);

  const handleClose = () => navigate("/admin/advanced/users");

  return (
    <Modal
      title="Profile"
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <UserInfoContent 
        user={user} 
        stats={stats} 
        loading={loading} 
        statsLoading={statsLoading} 
      />
    </Modal>
  );
}
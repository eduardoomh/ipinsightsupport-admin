import { useNavigate, useParams } from "@remix-run/react";
import { Avatar, Modal, message } from "antd";
import { useEffect, useState } from "react";
import type { UsersI } from "~/interfaces/users.interface";

export default function InfoUserModal() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<UsersI | null>(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <Modal
            title={`User info`}
            open={true}
            onCancel={handleClose}
            footer={null}
            width={720}
            destroyOnClose
        >
            {loading ? (
                <div className="text-center py-8">Loading user data...</div>
            ) : user ? (
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar size={80} className="bg-[#00a2ae] text-white">
                            {user?.name.charAt(0)}
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold">{user?.name}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500">{user?.phone}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p>{user?.is_admin ? "Admin" : "User"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p>{user?.is_active ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Manager</p>
                            <p>{user?.is_account_manager ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p>{user?.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last Login</p>
                            <p>{user?.last_login ? new Date(user?.last_login).toLocaleString() : "Never"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Created At</p>
                            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-red-500">User not found</div>
            )}
        </Modal>
    );
}
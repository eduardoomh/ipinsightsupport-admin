import { IdcardOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "@remix-run/react";
import { Divider, Modal, message, Skeleton, Avatar } from "antd";
import { useEffect, useState } from "react";
import { CompanyCard } from "~/components/basics/CompanyCard";
import { ClientProfileInfo } from "~/components/views/clients/ClientProfileInfo";
import type { ClientI } from "~/interfaces/clients.interface";

export default function InfoClientModal() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState<ClientI | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/clients/${clientId}`);
            const data = await res.json();
            setClient(data);
        } catch (err) {
            message.error("Failed to load company data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [clientId]);

    const handleClose = () => navigate("/admin/advanced/companies");

    return (
        <Modal
            title="Company info"
            open={true}
            onCancel={handleClose}
            footer={null}
            width={720}
            destroyOnClose
        >
            {loading ? (
                <div className="p-6">
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                    <Divider />
                    <Skeleton active paragraph={{ rows: 2 }} />
                </div>
            ) : client ? (
                <div className="p-4">
                    <CompanyCard company={client} />
                    <ClientProfileInfo company={client} />

                    {Array.isArray(client.contacts) && client.contacts.length > 0 && (
                        <>
                            <Divider />
                            <h2 className="text-l font-semibold mb-4">Contacts</h2>
                            <div className="flex flex-col gap-2">
                                {client.contacts.map((contact: any) => (
                                    <div
                                        key={contact.id}
                                        className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => navigate(`/admin/advanced/contacts/${contact.id}`)}
                                    >
                                        <Avatar
                                            size={40}
                                            icon={<IdcardOutlined />}
                                            style={{ backgroundColor: "#FFA500" }}
                                        />
                                        <div>
                                            <p className="font-medium">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="text-center text-red-500">Company not found</div>
            )}
        </Modal>
    );
}
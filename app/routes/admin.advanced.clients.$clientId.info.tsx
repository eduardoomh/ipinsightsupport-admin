import { useNavigate, useParams } from "@remix-run/react";
import { Divider, Modal, message } from "antd";
import { useEffect, useState } from "react";
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
            message.error("Failed to load client data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [clientId]);

    const handleClose = () => navigate("/admin/advanced/clients");

return (
    <Modal
        title={`Client info`}
        open={true}
        onCancel={handleClose}
        footer={null}
        width={720}
        destroyOnClose
    >
        {loading ? (
            <div className="text-center py-8">Loading client data...</div>
        ) : client ? (
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p>{client.company}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Timezone</p>
                        <p>{client.timezone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p>{client.createdAt ? new Date(client.createdAt).toLocaleString() : "Never"}</p>
                    </div>
                </div>

                {Array.isArray(client.contacts) && client.contacts.length > 0 && (
                    <>
                    <Divider />
                        <h2 className="text-l font-semibold mb-4">Contacts</h2>
                        <div className="flex flex-col gap-2">
                            {client.contacts.map((contact: any) => (
                                <div
                                    key={contact.id}
                                    className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm uppercase">
                                        {contact.name?.slice(0, 2)}
                                    </div>
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
            <div className="text-center text-red-500">Client not found</div>
        )}
    </Modal>
);
}
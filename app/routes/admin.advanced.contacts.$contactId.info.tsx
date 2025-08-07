import { useNavigate, useParams } from "@remix-run/react";
import { Divider, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { ContactI } from "~/interfaces/contact.interface";

export default function InfoContactModal() {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState<ContactI | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchContact = async () => {
        try {
            const res = await fetch(`/api/contacts/${contactId}`);
            const data = await res.json();
            setContact(data);
        } catch (err) {
            message.error("Failed to load contact data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
    }, [contactId]);

    const handleClose = () => navigate("/admin/advanced/contacts");

    return (
        <Modal
            title={`Contact Info`}
            open={true}
            onCancel={handleClose}
            footer={null}
            width={720}
            destroyOnClose
        >
            {loading ? (
                <div className="text-center py-8">Loading contact data...</div>
            ) : contact ? (
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p>{contact.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p>{contact.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p>{contact.phone}</p>
                        </div>
                    </div>

                    {contact.client && (
                        <>
                            <Divider />
                            <h2 className="text-l font-semibold mb-4">Related Client</h2>
                            <div className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm uppercase">
                                    {contact.client.company?.slice(0, 2)}
                                </div>
                                <div>
                                    <p className="font-medium">{contact.client.company}</p>
                                    <p className="text-sm text-gray-500">{contact.client.timezone}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="text-center text-red-500">Contact not found</div>
            )}
        </Modal>
    );
}
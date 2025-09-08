import { useNavigate, useParams } from "@remix-run/react";
import { Divider, Modal, message, Skeleton, Card, Avatar } from "antd";
import { useEffect, useState } from "react";
import { ContactCard } from "~/components/basics/ContactCard";
import { ContactProfileInfo } from "~/components/views/contacts/ContactProfileInfo";
import { ContactI } from "~/interfaces/contact.interface";
import { getClientStatusLabel } from '../utils/general/getClientStatusLabel';
import { ShopOutlined } from "@ant-design/icons";

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
            title="Contact Info"
            open={true}
            onCancel={handleClose}
            footer={null}
            width={720}
            destroyOnClose
        >
            {loading ? (
                <div className="p-4">
                    <Card bordered className="mb-6" style={{ borderColor: "#d9d9d9" }}>
                        <Skeleton.Avatar active size={60} shape="circle" className="mb-4" />
                        <Skeleton active paragraph={{ rows: 3 }} />
                    </Card>
                    <Card bordered style={{ borderColor: "#d9d9d9" }}>
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                </div>
            ) : contact ? (
                <div className="p-4">
                    <ContactCard contact={contact} />
                    <ContactProfileInfo contact={contact} />

                    {contact.client && (
                        <>
                            <Divider />
                            <h2 className="text-l font-semibold mb-4">Related Company</h2>
                            <div
                                className="w-full flex items-center gap-4 border p-4 shadow-sm bg-white rounded-none cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => navigate(`/admin/company/dashboard/${contact.client.id}`)}
                            >
                                <Avatar
                                    size={40}
                                    icon={<ShopOutlined />}
                                    style={{ backgroundColor: "#096584" }}
                                />
                                <div>
                                    <p className="font-medium">{contact.client.company}</p>
                                    <p className="text-sm text-gray-500">{getClientStatusLabel(contact.client.currentStatus as any)}</p>
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
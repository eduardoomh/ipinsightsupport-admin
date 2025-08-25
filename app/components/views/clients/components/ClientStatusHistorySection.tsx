import React, { useEffect, useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { Skeleton, Avatar, Alert } from "antd";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";
import { ClientStatusHistoryI } from "~/interfaces/clientStatusHistory";

interface Props {
    clientId: string;
}

const ClientStatusHistorySection: React.FC<Props> = ({ clientId }) => {
    const [history, setHistory] = useState<ClientStatusHistoryI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/client-status-history?client_id=${clientId}`);
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [clientId]);

    return (
        <ContentLayout title="Client Status History" type="basic_section" size="small">
            {loading ? (
                <>
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </>
            ) : history.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {history.map(item => (
                        <Alert
                            key={item.id}
                            type="info"
                            style={{ backgroundColor: "#f5f5f5", borderColor: "#d9d9d9" }}
                            message={
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <div style={{ fontWeight: 500, fontSize: 16 }}>
                                        {item.status ? getClientStatusLabel(item.status) : item.title || 'Actualización'}
                                    </div>
                                    <div
                                        style={{ fontSize: 14, color: "#333" }}
                                        dangerouslySetInnerHTML={{ __html: item.note }}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                        <Avatar
                                            size="small"
                                            src={item.changedBy?.avatar || undefined}
                                            style={{ backgroundColor: "#1890ff", color: "#fff" }}
                                        >
                                            {item.changedBy?.name ? item.changedBy.name[0] : "U"}
                                        </Avatar>
                                        <span style={{ fontSize: 14, color: "#555" }}>
                                            {item.changedBy?.name || "Unknown"} — {new Date(item.changedAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            }
                        />
                    ))}
                </div>
            ) : (
                <p>No status history available.</p>
            )}
        </ContentLayout>
    );
};

export default ClientStatusHistorySection;
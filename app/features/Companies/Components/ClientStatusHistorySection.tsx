import React, { useEffect, useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { Skeleton } from "antd";
import { ClientStatusHistoryI } from "~/interfaces/clientStatusHistory";
import Note from "~/components/basics/Note";

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
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {history.map((item) => (
                        <Note key={item.id} note={item} size="default" />
                    ))}
                </div>
            ) : (
                <p>No status history available.</p>
            )}
        </ContentLayout>
    );
};

export default ClientStatusHistorySection;
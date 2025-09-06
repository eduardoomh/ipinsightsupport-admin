import { Alert, Avatar } from "antd"
import { FC } from "react";
import { ClientStatusHistoryI } from "~/interfaces/clientStatusHistory"
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

interface Props {
    note: ClientStatusHistoryI;
    size?: "small" | "default";
}

const Note: FC<Props> = ({ note, size = "default" }) => {
    return (
        <Alert
            key={note.id}
            type="info"
            style={{ backgroundColor: "#f5f5f5", borderColor: "#d9d9d9" }}
            message={
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 500, fontSize: size === "small" ? 14 : 6 }}>
                        {note.status ? getClientStatusLabel(note.status) : note.title || 'Actualización'}
                    </div>
                    <div
                        style={{ fontSize: 14, color: "#333" }}
                        dangerouslySetInnerHTML={{ __html: note.note }}
                    />
                    {
                        size === "default" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                                <Avatar
                                    size="small"
                                    src={note.changedBy?.avatar || undefined}
                                    style={{ backgroundColor: "#1890ff", color: "#fff" }}
                                >
                                    {note.changedBy?.name ? note.changedBy.name[0] : "U"}
                                </Avatar>
                                <span style={{ fontSize: 14, color: "#555" }}>
                                    {note.changedBy?.name || "Unknown"} — {new Date(note.changedAt).toLocaleString()}
                                </span>
                            </div>
                        )
                    }
                </div>
            }
        />
    )
}

export default Note
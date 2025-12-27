import { Avatar } from "antd";
import { FC } from "react";
import { ClientStatusHistoryI } from "~/features/StatusHistory/Interfaces/clientStatusHistory.interface";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

interface Props {
    note: ClientStatusHistoryI;
    size?: "small" | "default";
}

const Note: FC<Props> = ({ note, size = "default" }) => {
    return (
        <div
            style={{
                position: "relative",
                background: "#fffbe6",
                border: "1px solid #f7d674",
                borderRadius: 10,
                padding: size === "small" ? "10px 12px" : "14px 16px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                marginTop: 4,
                overflow: "hidden",

                /* ⭐ textura suave de papel */
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23noise)\" opacity=\"0.08\"/%3E%3C/svg%3E')",
                backgroundSize: "cover",
            }}
        >
            {/* ⭐ esquina doblada */}
            <div
                style={{
                    content: "''",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderTop: "18px solid #fce7a2",
                    borderLeft: "18px solid transparent",
                }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Título / estado */}
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: size === "small" ? 14 : 16,
                        color: "#ad6800",
                    }}
                >
                    {note.status
                        ? getClientStatusLabel(note.status)
                        : note.title || "Actualización"}
                </div>

                {/* Contenido */}
                <div
                    style={{
                        fontSize: size === "small" ? 13 : 14,
                        color: "#444",
                        lineHeight: 1.4,
                    }}
                    dangerouslySetInnerHTML={{ __html: note.note }}
                />

                {/* Footer con avatar y fecha (solo en modo "default") */}
                {size === "default" && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 6,
                        }}
                    >
                        <Avatar
                            size="small"
                            src={note.changedBy?.avatar || undefined}
                            style={{ backgroundColor: "#1890ff", color: "#fff" }}
                        >
                            {note.changedBy?.name
                                ? note.changedBy.name[0]
                                : "U"}
                        </Avatar>
                        <span style={{ fontSize: 13, color: "#666" }}>
                            {note.changedBy?.name || "Unknown"} —{" "}
                            {new Date(note.changedAt).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Note;
import { FC } from "react";
import { Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

interface Props {
    label: string;           
    hours: number | string;  
    Icon: React.ElementType;
}

const HoursTag: FC<Props> = ({ label, hours, Icon }) => {
    return (
        <Tooltip title={label}>
            <div
                style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    padding: "10px 12px",
                    width: 70,
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                {/* Iconos */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Icon style={{ fontSize: 14, marginRight: 2 }} />
                    <ClockCircleOutlined style={{ fontSize: 14 }} />
                </div>

                {/* Valor */}
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {Number(hours).toFixed(2)}
                </div>
            </div>
        </Tooltip>
    );
};

export default HoursTag;
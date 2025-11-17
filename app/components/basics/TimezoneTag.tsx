// components/TimezoneTag.tsx
import { Tag, Tooltip } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { FC } from "react";

interface Props {
    timezone: string;
    label: string;
}

const TimezoneTag: FC<Props> = ({ timezone, label }) => {
    return (
        <Tooltip title={`Timezone: ${label}`}>
            <Tag
                color="cyan"
                style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6 
                }}
            >
                <GlobalOutlined />
                {label}
            </Tag>
        </Tooltip>
    );
};

export default TimezoneTag;
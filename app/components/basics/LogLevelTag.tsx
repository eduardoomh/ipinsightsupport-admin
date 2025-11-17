import { Tag } from "antd";
import { FC } from "react";
import {
    CloseCircleFilled,
    ExclamationCircleFilled,
    InfoCircleFilled
} from "@ant-design/icons";

export type LogLevel = "ERROR" | "WARNING" | "INFO";

interface Props {
    level: LogLevel;
}

const icons = {
    ERROR: <CloseCircleFilled />,
    WARNING: <ExclamationCircleFilled />,
    INFO: <InfoCircleFilled />
};

const labels = {
    ERROR: "Error",
    WARNING: "Warning",
    INFO: "Info"
};

const colors = {
    ERROR: "red",
    WARNING: "orange",
    INFO: "blue"
};

const LogLevelTag: FC<Props> = ({ level }) => (
    <Tag
        color={colors[level]}
        style={{
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
            fontSize: 12.5,
            lineHeight: "16px",
            borderRadius: 6,
            width: "fit-content",
        }}
    >
        {icons[level]}
        {labels[level]}
    </Tag>
);

export default LogLevelTag;
// components/StatusTag.tsx
import { Tag, Tooltip } from "antd";
import {
    ThunderboltOutlined,
    SyncOutlined,
    HourglassOutlined,
    ClockCircleOutlined,
    SwapOutlined,
    FolderOutlined,
    AppstoreOutlined
} from "@ant-design/icons";
import { FC } from "react";

type Status =
    | "ADHOC"
    | "IN_PROGRESS"
    | "ARCHIVE"
    | "WAITING_ON_AM"
    | "WAITING_ON_CLIENT"
    | "TRANSFER"
    | "ALL";

const statusConfig: Record<
    Status,
    { color: string; icon: JSX.Element; label: string }
> = {
    ADHOC: {
        color: "magenta",
        icon: <ThunderboltOutlined />,
        label: "Adhoc"
    },
    IN_PROGRESS: {
        color: "blue",
        icon: <SyncOutlined />,
        label: "In Progress"
    },
    WAITING_ON_AM: {
        color: "orange",
        icon: <HourglassOutlined />,
        label: "Waiting on AM"
    },
    WAITING_ON_CLIENT: {
        color: "gold",
        icon: <ClockCircleOutlined />,
        label: "Waiting on Client"
    },
    TRANSFER: {
        color: "purple",
        icon: <SwapOutlined />,
        label: "Transfer"
    },
    ARCHIVE: {
        color: "default",
        icon: <FolderOutlined />,
        label: "Archived"
    },
    ALL: {
        color: "default",
        icon: <AppstoreOutlined />,
        label: "All"
    }
};

interface Props {
    status: Status;
}

const StatusTag: FC<Props> = ({ status }) => {
    const config = statusConfig[status];

    return (
        <Tooltip title={config.label}>
            <Tag
                color={config.color}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                }}
            >
                {config.icon}
                {config.label}
            </Tag>
        </Tooltip>
    );
};

export default StatusTag;
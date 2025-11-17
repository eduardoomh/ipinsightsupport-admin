import { CalendarOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { FC } from "react";
import { formatUSDate } from "~/utils/fields/formatUsDate";

const DateUsFormat: FC<{ date: string }> = ({ date }) => {
    return (
        <Space>
            <CalendarOutlined style={{ color: "#1677ff" }} />
            {formatUSDate(date)}
        </Space>
    );
};

export default DateUsFormat;

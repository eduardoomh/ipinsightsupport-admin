import { UserOutlined } from "@ant-design/icons"
import { Tag } from "antd"
import { useAppMode } from "~/context/AppModeContext";

const TagMode = () => {
    const { mode } = useAppMode();

    return (
        <Tag color="purple" className="mt-1">
            <UserOutlined /> {" "}{mode === "user" ? "User" : "Admin"} Mode
        </Tag>
    )
}

export default TagMode
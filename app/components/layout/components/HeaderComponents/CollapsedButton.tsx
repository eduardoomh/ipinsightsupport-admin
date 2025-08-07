import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { FC } from "react";

interface Props {
    collapsed: boolean;
    toggleCollapsed: () => void;
}
const CollapsedButton: FC<Props> = ({ collapsed, toggleCollapsed }) => {
    return (
        <button
            className="w-full py-4 rounded-md flex justify-center items-center text-black"
            onClick={() => toggleCollapsed()}
        >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
    )
}

export default CollapsedButton
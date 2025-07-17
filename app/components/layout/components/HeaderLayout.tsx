import { DownSquareOutlined, SearchOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Avatar, Button, Popover, Input, Tag, Typography } from "antd"
import { FC, useState } from "react";
import UserMenu from "~/components/Menus/UserMenu"
import { useAppMode } from "~/context/AppModeContext";

interface Props {
    title: string;
    collapsed: boolean;
    toggleCollapsed: any;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'USER'
    }
}

const HeaderLayout: FC<Props> = ({ user, title, collapsed, toggleCollapsed }) => {
    const { Search } = Input
    const { mode } = useAppMode();

    const [popoverVisible, setPopoverVisible] = useState(false);

    const handleVisibleChange = (visible: boolean) => {
        setPopoverVisible(visible);
    };


    return (
        <div className="flex justify-between items-center gap-4 
                bg-light_gray text-high_blue px-4 py-2 
                border-b border-high_gray shadow-md">
            <div className="flex justify-start items-center">
                <button
                    className="w-full py-4 rounded-md flex justify-center items-center text-black"
                    onClick={() => toggleCollapsed()}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <img src="/IP-Insight-Support-Logo.webp" width={220} />
                <Tag className="border-[#d48806] text-[#d48806] bg-[#fffbe6] mt-1">{mode === 'user' ? 'User' : 'Admin'} Mode</Tag>
            </div>
            <Search
                placeholder="Buscar..."
                onSearch={() => { }}
                enterButton={
                    <Button
                        icon={<SearchOutlined />}
                        style={{ backgroundColor: "#c3e9f8", color: "#00AAE7", border: "1px solid #00AAE7" }}
                    />
                }
                size="middle"
                style={{ width: 300 }}
            />
            <Popover
                content={<UserMenu user={user} />}
                trigger="click"
                placement="bottomRight"
                open={popoverVisible}
                onOpenChange={handleVisibleChange}
                arrow={false}
                overlayInnerStyle={{ marginTop: 8, padding: 0, borderRadius: 8 }}

            >
                <div
                    className="flex items-center gap-2 cursor-pointer px-2 py-2 
             hover:bg-[#e6e6e6] rounded-[4px] transition-all duration-200 
             hover:scale-[1.02] hover:shadow-sm"
                >
                    <Avatar size={36} className="bg-[#00a2ae] text-white">
                        {user.name.charAt(0)}
                    </Avatar>
                    <Typography>{user.name}</Typography>
                </div>
            </Popover>
        </div>
    )
}

export default HeaderLayout
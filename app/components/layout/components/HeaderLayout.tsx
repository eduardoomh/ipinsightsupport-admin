import { DownSquareOutlined, SearchOutlined, DownOutlined } from "@ant-design/icons"
import { Avatar, Button, Popover, Input } from "antd"
import { FC, useState } from "react";
import UserMenu from "~/components/Menus/UserMenu"

interface Props {
    title: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'USER'
    }
}

const HeaderLayout: FC<Props> = ({ user, title }) => {
    const { Search } = Input

    const [popoverVisible, setPopoverVisible] = useState(false);

    const handleVisibleChange = (visible: boolean) => {
        setPopoverVisible(visible);
    };


    return (
        <div className="flex justify-end items-center gap-4 bg-light_gray text-high_blue py-4 px-8 border-b border-high_gray">
            <Search
                placeholder="Buscar..."
                onSearch={() => { }}
                enterButton={
                    <Button
                        icon={<SearchOutlined />}
                        style={{ backgroundColor: "#c3e9f8", color: "#00AAE7", border: "1px solid #00AAE7"}}
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
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar size={36} className="bg-base_blue border-high_blue text-high_blue">
                        {user.name.charAt(0)}
                    </Avatar>
                    <DownOutlined style={{ fontSize: "1rem" }} />
                </div>
            </Popover>
        </div>
    )
}

export default HeaderLayout
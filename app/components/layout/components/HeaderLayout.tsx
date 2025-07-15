import { DownSquareOutlined, SearchOutlined } from "@ant-design/icons"
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
                        style={{ backgroundColor: "#00AAE7", color: "#fff" }}
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
                    <Avatar size={36} className="bg-high_blue">A</Avatar>
                    <DownSquareOutlined style={{ fontSize: "1.5rem" }} />
                </div>
            </Popover>
        </div>
    )
}

export default HeaderLayout
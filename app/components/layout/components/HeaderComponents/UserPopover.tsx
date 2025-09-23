import { Avatar, Popover, Typography } from "antd"
import { FC, useState } from "react"
import UserMenu from "~/components/Menus/UserMenu"
import ArrowIcon from '~/assets/icons/shape.svg';

interface Props {
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "USER" | "CLIENT";
    };
}

const UserPopover: FC<Props> = ({ user }) => {
    const [popoverVisible, setPopoverVisible] = useState(false);

    const handleVisibleChange = (visible: boolean) => {
        setPopoverVisible(visible);
    };

    return (
        <Popover
            content={<UserMenu user={user} />}
            trigger="click"
            placement="bottomRight"
            open={popoverVisible}
            onOpenChange={handleVisibleChange}
            arrow={false}
            overlayInnerStyle={{
                marginTop: 8,
                padding: 0,
                borderRadius: 8,
            }}
        >
            <div
                className="flex items-center gap-2 cursor-pointer px-2 py-2 
                           hover:bg-[#e6e6e6] rounded-[4px] transition-all duration-200 
                           hover:scale-[1.02] hover:shadow-sm"
            >
                <Avatar size={36} className="bg-[#00a2ae] text-white">
                    {user?.name.charAt(0)}
                </Avatar>
                <div className="flex items-center gap-1">
                    <Typography>{user?.name}</Typography>
                    <img src={ArrowIcon} alt="arrow icon" className="w-4 h-4 ml-3" />
                </div>
            </div>
        </Popover>
    )
}

export default UserPopover
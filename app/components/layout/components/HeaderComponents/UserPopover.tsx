import { Avatar, Popover, Typography, Modal } from "antd"
import { FC, useState } from "react"
import UserMenu from "~/components/Menus/UserMenu"
import ArrowIcon from '~/assets/icons/shape.svg';
import { UserRole } from "~/interfaces/users.interface";

interface Props {
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

const UserPopover: FC<Props> = ({ user }) => {
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handlePopoverVisibleChange = (visible: boolean) => {
        setPopoverVisible(visible);
    };

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <>
            <Popover
                content={<UserMenu user={user} />}
                trigger="click"
                placement="bottomRight"
                open={popoverVisible}
                onOpenChange={handlePopoverVisibleChange}
                arrow={false}
                overlayInnerStyle={{
                    marginTop: 8,
                    padding: 0,
                    borderRadius: 8,
                }}
            >
                <div
                    className="hidden md:flex items-center gap-2 cursor-pointer px-2 py-2 
                               hover:bg-[#e6e6e6] rounded-[4px] transition-all duration-200 
                               hover:scale-[1.02] hover:shadow-sm"
                >
                    <Avatar size={36} className="bg-[#00a2ae] text-white flex-shrink-0" style={{ width: 36, height: 36, lineHeight: '36px' }}>
                        {user?.name.charAt(0)}
                    </Avatar>
                    <div className="flex items-center gap-1">
                        <Typography>{user?.name}</Typography>
                        <img src={ArrowIcon} alt="arrow icon" className="w-4 h-4 ml-3" />
                    </div>
                </div>
            </Popover>

            <div
                className="md:hidden flex items-center gap-2 cursor-pointer px-2 py-2 
                           hover:bg-[#e6e6e6] rounded-[4px] transition-all duration-200 
                           hover:scale-[1.02] hover:shadow-sm"
                onClick={handleModalOpen}
            >
                <Avatar size={36} className="bg-[#00a2ae] text-white flex-shrink-0" style={{ width: 36, height: 36, lineHeight: '36px' }}>
                    {user?.name.charAt(0)}
                </Avatar>
                <img src={ArrowIcon} alt="arrow icon" className="w-4 h-4 ml-3" />
            </div>

            <Modal
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                closable={true}
                centered
                width={400}
                bodyStyle={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            >
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar size={64} className="bg-[#00a2ae] text-white flex-shrink-0" style={{ width: 64, height: 64, lineHeight: '64px' }}>
                            {user?.name.charAt(0)}
                        </Avatar>
                        <Typography style={{ marginTop: 8 }}>{user?.name}</Typography>
                    </div>
                    <UserMenu user={user} />
                </div>
            </Modal>
        </>
    )
}

export default UserPopover
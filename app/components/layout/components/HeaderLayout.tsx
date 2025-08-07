import { FC } from "react";
import TagMode from "./HeaderComponents/TagMode";
import CollapsedButton from "./HeaderComponents/CollapsedButton";
import UserPopover from "./HeaderComponents/UserPopover";

interface Props {
    title: string;
    collapsed: boolean;
    toggleCollapsed: any;
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "USER";
    };
}

const HeaderLayout: FC<Props> = ({ user, collapsed, toggleCollapsed }) => {

    return (
        <div
            className="flex justify-between items-center gap-4 px-8 py-2 text-high_blue mb-8"
            style={{
                backgroundColor: "#FFF",
                borderBottom: "1px solid #01ABE8",
                boxShadow: "1px 1px 4px 0 rgba(25, 39, 44, 0.3)",
            }}
        >
            <div className="flex justify-start items-center">
                <CollapsedButton collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <img src="/IP-Insight-Support-Logo.webp" width={220} />
                <TagMode />
            </div>
            <UserPopover user={user} />
        </div>
    );
};

export default HeaderLayout;
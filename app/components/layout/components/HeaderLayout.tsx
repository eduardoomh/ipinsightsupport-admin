import { FC } from "react";
import TagMode from "./HeaderComponents/TagMode";
import CollapsedButton from "./HeaderComponents/CollapsedButton";
import UserPopover from "./HeaderComponents/UserPopover";
import SearchModal from "~/components/search/SearchModal";

interface Props {
    title: string;
    collapsed: boolean;
    toggleCollapsed: any;
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "USER" | "CLIENT";
    };
}

const HeaderLayout: FC<Props> = ({ user, collapsed, toggleCollapsed }) => {

    return (
        <div
            className="flex justify-between items-center gap-4 px-8 py-2 text-high_blue"
            style={{
                backgroundColor: "#FFF",
                boxShadow: "1px 1px 4px 0 rgba(25, 39, 44, 0.3)",
            }}
        >
            <div className="flex justify-start items-center">
                <CollapsedButton collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <img src="/sentinelux-logo.png" width={220} />
                {
                    user.role === "ADMIN" && (
                        <TagMode />
                    )
                }

            </div>
            {
                user.role !== "CLIENT" && (
                    <SearchModal />
                )
            }
            <UserPopover user={user} />
        </div>
    );
};

export default HeaderLayout;
import { FC, useContext } from "react";
import MainMenu from "../../Menus/MainMenu";
import { useAppMode } from "~/context/AppModeContext";
import AdminMenu from "~/components/Menus/AdminMenu";
import { UserContext } from "~/context/UserContext";
import CompanyMainMenu from "~/components/Menus/CompanyMainMenu";
import { UserRole } from "~/features/Users/Interfaces/users.interface";
import { AppMode } from "~/interfaces/app.interface";
import TagMode from "./HeaderComponents/TagMode";

interface Props {
  collapsed: boolean;
  toggleCollapsed: any;
}

const Sidebar: FC<Props> = ({ collapsed }) => {
  const { mode } = useAppMode();
  const user = useContext(UserContext)

  return (
    <aside
      className={`border-r px-4 border-high_blue flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} bg-darken_blue`}
      style={{
        height: "calc(100vh - 68px)",
        paddingTop: "24px",
        marginRight: "32px",
        borderTop: "1px solid #92C5D7",
        borderRight: "1px solid #92C5D7",
        boxShadow: "0px 1px 4px rgba(10, 95, 108, 0.3)",
      }}
    >
      <div className="flex-1 overflow-y-auto mt-2">
        {mode === AppMode.User ? (
          <>
            {user.role === UserRole.CLIENT && user?.company_id ? (
              <CompanyMainMenu collapsed={collapsed} />
            ) : (
              <>
                {!collapsed && (
                  <div className="mb-2 block md:hidden">
                    <TagMode role={user.role} fullWidth />
                  </div>
                )}
                <MainMenu collapsed={collapsed} />
              </>
            )}
          </>
        ) : (
          <>
            {!collapsed && (
              <div className="mb-2 block md:hidden">
                <TagMode role={user.role} fullWidth />
              </div>
            )}
            <AdminMenu collapsed={collapsed} />
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
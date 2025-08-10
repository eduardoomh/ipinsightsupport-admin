import { FC } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import MainMenu from "../../Menus/MainMenu";
import { useAppMode } from "~/context/AppModeContext";
import { useNavigate, useLocation } from "@remix-run/react";
import AdminMenu from "~/components/Menus/AdminMenu";
import ClientMenu from "~/components/Menus/ClientMenu";

interface Props {
  collapsed: boolean;
  toggleCollapsed: any;
}

const Sidebar: FC<Props> = ({ collapsed }) => {
  const { mode, setMode } = useAppMode();
  const navigate = useNavigate();
  const location = useLocation();

  const changeMode = () => {
    let currentMode = mode;
    setMode(currentMode === "user" ? "admin" : "user");

    setTimeout(() => {
      navigate(currentMode === "user" ? "/admin/home" : "/");
    }, 200);
  };

  return (
    <aside
      className={`border-r px-4 border-high_blue flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} bg-light_blue`}
      style={{
        height: "calc(100vh - 69px - 32px)",
        paddingTop: "29px",
        marginRight: "32px",
        borderTop: "1px solid #92C5D7",
        borderRight: "1px solid #92C5D7",
        borderTopRightRadius: "12px",
        boxShadow: "0px 1px 4px rgba(10, 95, 108, 0.3)",
      }}
    >
      {/* Botón superior */}
      {!collapsed && (
        <div className="px-4">
          <Button
            icon={<UserOutlined />}
            onClick={changeMode}
            className="bg-light_blue border-[#0b5772] text-[#0b5772] w-full h-8 
              transition-transform duration-200 ease-in-out flex items-center text-l mb-4 hover:scale-105 !hover:border-[#0b5772] !hover:text-[#0b5772]"
          >
            {mode === "user" ? "Go to Admin Mode" : "Go to User Mode"}
          </Button>
        </div>
      )}

      {/* Menú scrollable */}
      <div className="flex-1 overflow-y-auto mt-2">
        {mode === "user" ? (
          <MainMenu collapsed={collapsed} />
        ) : (
          <AdminMenu collapsed={collapsed} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
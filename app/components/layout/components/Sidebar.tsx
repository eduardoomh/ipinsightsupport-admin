import { FC } from "react";
import MainMenu from "../../Menus/MainMenu";
import { useAppMode } from "~/context/AppModeContext";
import AdminMenu from "~/components/Menus/AdminMenu";

interface Props {
  collapsed: boolean;
  toggleCollapsed: any;
}

const Sidebar: FC<Props> = ({ collapsed }) => {
  const { mode } = useAppMode();

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
      {/* Botón superior */}
      {!collapsed && (
        <div
          style={{
            border: "1px solid white",
            borderWidth: "1px 0 1px 0",
            padding: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
            marginBottom: "8px"
          }}>
          <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: "500", textAlign: "center" }}>Sentinelux  🧠</h1>
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
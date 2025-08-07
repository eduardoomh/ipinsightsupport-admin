import { FC, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderLayout from "./components/HeaderLayout";
import { UserContext } from "~/context/UserContext";
import { useMediaQuery } from "react-responsive";
import ContentLayout from "./components/ContentLayout";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  headerActions?: ReactNode;
}

const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({
  children,
  title,
  headerActions
}) => {
  const user = useContext(UserContext);
  console.log(user, "no user?")
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <main className="bg-light_blue w-screen h-screen flex flex-col flex-1" style={{ backgroundColor: "#F6F7F7" }}>
      <HeaderLayout
        user={user as any}
        title={title}
        toggleCollapsed={toggleCollapsed}
        collapsed={collapsed}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <ContentLayout type="basic_section" title={title} headerActions={headerActions}>
          {children}
        </ContentLayout>
      </div>
    </main>
  );
};

export default DashboardLayout;
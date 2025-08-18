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
  type?: 'basic_section' | 'client_section'
  id?: string;
  companyStatus?: string;
  menuType?: "ADMIN" | "USER" | "CLIENT";
}

const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({
  children,
  title,
  headerActions,
  id,
  type = 'basic_section',
  companyStatus,
  menuType = "ADMIN"
}) => {
  const user = useContext(UserContext);
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <main className="bg-light_blue w-screen h-screen flex flex-col flex-1" style={{ backgroundColor: "#F5F9FA" }}>
      <HeaderLayout
        user={user as any}
        title={title}
        toggleCollapsed={toggleCollapsed}
        collapsed={collapsed}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        <ContentLayout 
          type={type} 
          title={title} 
          headerActions={headerActions} 
          id={id} tailwindClass={'mt-8'} 
          companyStatus={companyStatus} 
          menuType={menuType}
        >
          {children}
        </ContentLayout>
      </div>
    </main>
  );
};

export default DashboardLayout;
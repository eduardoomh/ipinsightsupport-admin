import { FC, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderLayout from "./components/HeaderLayout";
import { useAppMode } from "~/context/AppModeContext";
import { UserContext } from "~/context/UserContext";
import { useMediaQuery } from "react-responsive";

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({ children, title }) => {
    const user = useContext(UserContext);
    const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const toggleCollapsed = () => setCollapsed(!collapsed)

    return (
        <main className="bg-light_blue w-screen h-screen flex flex-col flex-1">
            <HeaderLayout
                user={user as any}
                title={title}
                toggleCollapsed={toggleCollapsed}
                collapsed={collapsed}
            />
            <div className="flex flex-1 min-h-0"> {/* 👈 clave para scroll interno */}
                <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <div className="px-12 py-8 bg-white flex-1 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-high_blue">{title}</h1>
                    {children}
                </div>
            </div>
        </main>
    );
};

export default DashboardLayout;
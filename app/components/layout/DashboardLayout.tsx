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
        <main className="bg-light_blue overflow-y-auto w-screen h-screen flex flex-col flex-1">
            <HeaderLayout user={user as any} title={title} toggleCollapsed={toggleCollapsed} collapsed={collapsed} />
            <div className="flex h-screen">
                <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                <div className="px-12 py-8 bg-white flex-1">
                    <h1 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-high_blue">{title}</h1>
                    {children}
                </div>
            </div>
        </main>
    );
};

export default DashboardLayout;
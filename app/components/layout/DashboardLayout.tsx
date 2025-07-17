import { FC, PropsWithChildren, ReactNode, useContext } from "react";
import Sidebar from "../Sidebar";
import HeaderLayout from "./components/HeaderLayout";
import { useAppMode } from "~/context/AppModeContext";
import { UserContext } from "~/context/UserContext";

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({ children, title }) => {
    const user = useContext(UserContext);

    return (
        <main className="flex justify-start h-screen w-screen bg-light_blue">
            <Sidebar />

            <div className="bg-light_blue overflow-y-auto w-screen flex flex-col">
                <HeaderLayout user={user as any} title={title} />
                <div className="px-12 py-8 bg-white h-auto flex-1">
                    <h1 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-high_blue">{title}</h1>
                    {children}
                </div>
            </div>
        </main>
    );
};

export default DashboardLayout;
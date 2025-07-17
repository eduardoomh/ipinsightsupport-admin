import { FC } from "react"
import { UserOutlined } from "@ant-design/icons"
import { Button } from "antd"
import MainMenu from "../../Menus/MainMenu"
import { useAppMode } from "~/context/AppModeContext"
import { useNavigate } from "@remix-run/react";
import AdminMenu from "~/components/Menus/AdminMenu"

interface Props {
    collapsed: boolean;
    toggleCollapsed: any;
}

const Sidebar: FC<Props> = ({ collapsed }) => {
    const { mode, setMode } = useAppMode();
     const navigate = useNavigate();

    const changeMode = () =>{
        let currentMode = mode
        setMode(currentMode === 'user' ? 'admin' : 'user')

        setTimeout(() =>{
            navigate(currentMode === 'user' ? '/admin/home' : '/')
        },200)
        
    }

    return (
        <aside
            className={`border-r px-4 border-high_blue flex flex-col justify-between transition-all duration-300 shadow-lg
                ${collapsed ? "w-20" : "w-64"} bg-light_blue`}
        >
            <div className="flex flex-col items-center pt-8">
                {/* Tag */}
                {!collapsed && (
                    <div className="w-full px-4">
                        <Button
                            icon={<UserOutlined />}
                            onClick={changeMode}
                            className="bg-light_blue border-[#0b5772] text-[#0b5772] w-full h-8 
                            transition-transform duration-200 ease-in-out flex items-center text-l mb-4 hover:scale-105 !hover:border-[##0b5772] !hover:text-[##0b5772]"
                        >
                            {mode === 'user' ? 'Go to Admin Mode' : 'Go to User Mode'}
                        </Button>
                    </div>

                )}

                {/* Menu */}
                {
                    mode === 'user' ? (
                        <MainMenu collapsed={collapsed} />
                    ) : (
                        <AdminMenu collapsed={collapsed} />
                    )
                }
                

            </div>
        </aside>
    )
}

export default Sidebar
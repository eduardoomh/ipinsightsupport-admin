import { useEffect, useState } from "react"
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import { Tag } from "antd"
import { useMediaQuery } from "react-responsive"
import MainMenu from "./Menus/MainMenu"

const Sidebar = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const toggleCollapsed = () => setCollapsed(!collapsed)

    return (
        <aside
            className={`border-r px-4 border-high_blue flex flex-col justify-between transition-all duration-300
                ${collapsed ? "w-20" : "w-64"} h-screen bg-light_blue`}
        >
            <div className="flex flex-col items-center">
                {/* Logo */}
                {!collapsed ? (
                    <div className="pt-6 pb-2">
                        <img src="/IP-Insight-Support-Logo.webp" width={220} />
                    </div>
                ) : (
                    <div className="py-6">
                        <img src="/IP-Insight-collapsed.png" width={50} />
                    </div>
                )
                }

                {/* Tag */}
                {!collapsed && (
                    <Tag
                        icon={<UserOutlined />}
                        className="bg-light_blue border-high_blue text-high_blue w-24 h-6 flex items-center text-l mb-8"
                    >
                        User Mode
                    </Tag>
                )}

                {/* Menu */}
                <MainMenu collapsed={collapsed} />

            </div>

            {/* Botón para colapsar */}
            <button
                className="w-full py-4 flex justify-center items-center hover:bg-gray-100"
                onClick={toggleCollapsed}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
        </aside>
    )
}

export default Sidebar
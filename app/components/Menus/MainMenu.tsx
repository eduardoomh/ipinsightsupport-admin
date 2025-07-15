import React from 'react';
import { Link, useLocation } from "@remix-run/react";
import {
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'home',
        icon: <PieChartOutlined />,
        label: <Link to="/">Home</Link>,
    },
    {
        key: 'schedule', // ✅ corregido
        icon: <DesktopOutlined />,
        label: <Link to="/schedule">Schedule</Link>,
    },
    {
        key: 'work-entries',
        label: 'Work entries',
        icon: <MailOutlined />,
        children: [
            {
                key: 'all-entries',
                label: <Link to="/entries">All entries</Link>,
            },
            {
                key: 'personal-entries',
                label: <Link to="/personal-entries">Personal entries</Link>,
            },
        ],
    },
    {
        key: 'status-report',
        icon: <ContainerOutlined />,
        label: <Link to="/status-report">Status report</Link>,
    }
];

const pathToKey: Record<string, string> = {
    "/": "home",
    "/schedule": "schedule",
    "/entries": "all-entries",
    "/personal-entries": "personal-entries",
    "/status-report": "status-report",
};

type Props = {
    collapsed: boolean;
};

const MainMenu: React.FC<Props> = ({ collapsed }) => {
    const location = useLocation();
    const selectedKey = pathToKey[location.pathname] || 'home';

    return (
        <Menu
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['work-entries']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
            className="bg-light_blue"
            style={{ border: 0, width: '100%' }}
        />
    );
};

export default MainMenu;
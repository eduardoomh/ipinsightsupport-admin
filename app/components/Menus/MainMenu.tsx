import React, { useContext } from 'react';
import { Link, useLocation } from "@remix-run/react";
import {
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { UserContext } from '~/context/UserContext';

type MenuItem = Required<MenuProps>['items'][number];

const items = (id: string): MenuItem[] => {
    return [
        {
            key: 'home',
            icon: <PieChartOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: 'schedule',
            icon: <DesktopOutlined />,
            label: <Link to="/schedule">Schedule</Link>,
        },
        {
            key: 'work-entries',
            label: 'Work entries',
            icon: <MailOutlined />,
            children: [
                {
                    key: 'personal-entries',
                    label: <Link to={`/entries/${id}`}>Personal entries</Link>,
                }
            ],
        },
        {
            key: 'status-report',
            icon: <ContainerOutlined />,
            label: <Link to="/status-report">Status report</Link>,
        }
    ]
}

const pathToKey = (id: any): Record<string, string> => {
    return {
        "/": "home",
        "/schedule": "schedule",
        [`/entries/${id}`]: "personal-entries",
        "/status-report": "status-report",
    }

};

type Props = {
    collapsed: boolean;
};

const MainMenu: React.FC<Props> = ({ collapsed }) => {
    const location = useLocation();
    const user = useContext(UserContext)
    const selectedKey = pathToKey(user.id)[location.pathname] || 'home';;

    return (
        <Menu
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['work-entries']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items(user.id)}
            className="bg-darken_blue"
            style={{ border: 0, width: '100%' }}
        />
    );
};

export default MainMenu;
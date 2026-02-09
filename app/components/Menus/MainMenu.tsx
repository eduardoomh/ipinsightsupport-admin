import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from "@remix-run/react";
import {
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
            key: 'companies',
            icon: <DesktopOutlined />,
            label: <Link to={`/companies/${id}`}>Companies</Link>,
        },
        {
            key: 'work-entries',
            icon: <MailOutlined />,
            label: <Link to={`/entries/${id}`}>Work entries</Link>,
        }
    ]
}

const pathToKey = (id: any): Record<string, string> => {
    return {
        "/": "home",
        [`/companies/${id}`]: "companies",
        [`/entries/${id}`]: "personal-entries",
        "/reports": "reports",
    }

};

type Props = {
    collapsed: boolean;
};

const MainMenu: React.FC<Props> = ({ collapsed }) => {
    const location = useLocation();
    const user = useContext(UserContext)
    const selectedKey = pathToKey(user.id)[location.pathname] || 'home';

        useEffect(() =>{
            console.log(user, "user")
        },[user])

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
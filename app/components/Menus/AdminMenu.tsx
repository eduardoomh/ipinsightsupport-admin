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
        label: <Link to="/admin/home">Home</Link>,
    },
    {
        key: 'companies',
        icon: <PieChartOutlined />,
        label: <Link to="/admin/companies">Companies</Link>,
    },
    {
        key: 'schedule',
        icon: <DesktopOutlined />,
        label: <Link to="/admin/schedule">Schedule</Link>,
    },
    {
        key: 'balances',
        icon: <DesktopOutlined />,
        label: <Link to="/admin/balances">Balances</Link>,
    },
    {
        key: 'admin-work-entries',
        icon: <ContainerOutlined />,
        label: <Link to="/admin/work-entries">Work entries</Link>,
    },
    {
        key: 'advanced',
        label: 'Advanced',
        icon: <MailOutlined />,
        children: [
            {
                key: 'advanced-users',
                label: <Link to="/admin/advanced/users">Users</Link>,
            },
            {
                key: 'advanced-companies',
                label: <Link to="/admin/advanced/companies">Companies</Link>
            },
            {
                key: 'advanced-contacts',
                label: <Link to="/admin/advanced/contacts">Contacts</Link>
            },
            {
                key: 'advanced-logs',
                label: <Link to="/admin/advanced/logs">Logs</Link>
            },
        ],
    },
    {
        key: 'admin-reports',
        icon: <ContainerOutlined />,
        label: <Link to="/admin/reports">Reports</Link>,
    }
];

const pathToKey: Record<string, string> = {
    "/admin/home": "home",
    "/admin/companies": "companies",
    "/admin/schedule": "schedule",
    "/admin/balances": "balances",
    "/admin/work-entries": "admin-work-entries",
    "/admin/advanced/users": "advanced-users",
    "/admin/advanced/companies": "advanced-companies",
    "/admin/advanced/contacts": "advanced-contacts",
    "/admin/advanced/logs": "advanced-logs",
    "/admin/reports": "admin-reports",
};

type Props = {
    collapsed: boolean;
};

const AdminMenu: React.FC<Props> = ({ collapsed }) => {
    const location = useLocation();
    const selectedKey = pathToKey[location.pathname] || 'home';

    return (
        <Menu
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['advanced']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
            className="bg-darken_blue"
            style={{ border: 0, width: '100%' }}
        />
    );
};

export default AdminMenu;
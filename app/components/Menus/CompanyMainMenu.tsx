import React, { useContext } from 'react';
import { Link, useLocation } from "@remix-run/react";
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { UserContext } from '~/context/UserContext';

type MenuItem = Required<MenuProps>['items'][number];

const items = (id: string): MenuItem[] => {
    return [
        {
            key: 'company',
            icon: <PieChartOutlined />,
            label: <Link to={`/company/dashboard/${id}`}>Company</Link>,
        },
        {
            key: 'schedule',
            icon: <DesktopOutlined />,
            label: <Link to="/schedule">Schedule</Link>,
        }
    ]
}

const pathToKey = (id: any): Record<string, string> => {
    return {
        [`/company/dashboard/${id}`]: "company",
        "/schedule": "schedule",
    }

};

type Props = {
    collapsed: boolean;
};

const CompanyMainMenu: React.FC<Props> = ({ collapsed }) => {
    const location = useLocation();
    const user = useContext(UserContext)
    const selectedKey = pathToKey(user?.company_id)[location.pathname] || `/company/dashboard/${user.company_id}`;

    return (
        <Menu
            selectedKeys={[selectedKey]}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items(user?.company_id)}
            className="bg-darken_blue"
            style={{ border: 0, width: '100%' }}
        />
    );
};

export default CompanyMainMenu;
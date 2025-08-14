import React from "react";
import { Link, useLocation } from "@remix-run/react";
import {
  DashboardOutlined,
  FileTextOutlined,
  DollarOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
  EditOutlined,
  TeamOutlined,
  SettingOutlined,
  ContactsOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "work-entries",
    icon: <FileTextOutlined />,
    label: <Link to="/admin/work-entries">Work Entries</Link>,
  },
  {
    key: "retainers",
    icon: <DollarOutlined />,
    label: <Link to="/admin/retainers">Retainers</Link>,
  },
  {
    key: "invoices",
    icon: <FileAddOutlined />,
    label: <Link to="/admin/invoices">Invoices</Link>,
  },
  {
    key: "statistics",
    icon: <BarChartOutlined />,
    label: <Link to="/admin/statistics">Statistics</Link>,
  },
  {
    key: "actions",
    label: "Manage",
    icon: <SettingOutlined />,
    children: [
      {
        key: "edit-account-manager",
        icon: <EditOutlined />,
        label: <Link to="/admin/account-manager/edit">Edit Account Manager</Link>,
      },
      {
        key: "edit-region",
        icon: <EditOutlined />,
        label: <Link to="/admin/region/edit">Edit Region</Link>,
      },
      {
        key: "change-status",
        icon: <EditOutlined />,
        label: <Link to="/admin/status/edit">Change Status</Link>,
      },
      {
        key: "manage-contacts",
        icon: <ContactsOutlined />,
        label: <Link to="/admin/contacts">Manage Contacts</Link>,
      },
      {
        key: "manage-rates",
        icon: <DollarOutlined />,
        label: <Link to="/admin/rates">Manage Rates</Link>,
      },
      {
        key: "manage-team",
        icon: <TeamOutlined />,
        label: <Link to="/admin/team">Manage Team</Link>,
      },
      {
        key: "add-note-update",
        icon: <EditOutlined />,
        label: <Link to="/admin/notes/new">Add Note/Update</Link>,
      },
    ],
  },
];

const pathToKey: Record<string, string> = {
  "/admin/dashboard": "dashboard",
  "/admin/work-entries": "work-entries",
  "/admin/retainers": "retainers",
  "/admin/invoices": "invoices",
  "/admin/statistics": "statistics",
  "/admin/retainers/new": "add-retainer",
  "/admin/account-manager/edit": "edit-account-manager",
  "/admin/region/edit": "edit-region",
  "/admin/status/edit": "change-status",
  "/admin/work-entries/new": "add-work-entry",
  "/admin/contacts": "manage-contacts",
  "/admin/rates": "manage-rates",
  "/admin/team": "manage-team",
  "/admin/notes/new": "add-note-update",
};

type Props = {
  collapsed: boolean;
};

const ClientMenu: React.FC<Props> = ({ collapsed }) => {
  const location = useLocation();
  const selectedKey = pathToKey[location.pathname] || "dashboard";

  return (
    <Menu
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["actions"]}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
      className="bg-darken_blue"
      style={{ border: 0, width: "100%" }}
    />
  );
};

export default ClientMenu;
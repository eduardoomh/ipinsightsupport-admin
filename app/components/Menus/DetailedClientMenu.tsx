import React, { ReactElement } from "react";
import { Link, useLocation } from "@remix-run/react";
import {
  DashboardOutlined,
  FileTextOutlined,
  DollarOutlined,
  EditOutlined,
  TeamOutlined,
  SettingOutlined,
  ContactsOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  collapsed: boolean;
  clientId: string;
};

// Type guard para checar que item.label es ReactElement con prop "to" string
function isReactElementWithToProp(
  element: unknown
): element is ReactElement<{ to: string }> {
  return (
    React.isValidElement(element) &&
    element.props !== undefined &&
    //@ts-ignore
    typeof element.props.to === "string"
  );
}

const DetailedClientMenu: React.FC<Props> = ({ collapsed, clientId }) => {
  const location = useLocation();
  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to={`/admin/company/dashboard/${clientId}`}>Dashboard</Link>,
    },
    {
      key: "work-entries",
      icon: <FileTextOutlined />,
      label: <Link to={`/admin/company/work-entries/${clientId}`}>Work Entries</Link>,
    },
    {
      key: "retainers",
      icon: <DollarOutlined />,
      label: <Link to={`/admin/company/retainers/${clientId}`}>Retainers</Link>,
    },
    {
      key: "invoices",
      icon: <FileAddOutlined />,
      label: <Link to={`/admin/company/invoices/${clientId}`}>Invoices</Link>,
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
          label: <Link to={`/admin/company/rates/${clientId}`}>Manage Rates</Link>,
        },
        {
          key: "manage-team",
          icon: <TeamOutlined />,
          label: <Link to={`/admin/company/team-members/${clientId}`}>Manage Team</Link>,
        },
        {
          key: "add-note-update",
          icon: <EditOutlined />,
          label: <Link to="/admin/notes/new">Add Note/Update</Link>,
        },
      ],
    },
  ] as MenuItem[];

  // Aplanamos items para incluir también children
  const flattenItems = items.flatMap(item =>
        //@ts-ignore
    item.children ? item.children : item
  ) as MenuItem[];

  // Detectar selectedKey comparando pathname con "to" de cada Link
  let selectedKey = "dashboard";
  for (const item of flattenItems) {
        //@ts-ignore
    if (isReactElementWithToProp(item.label)) {
          //@ts-ignore
      const to = item.label.props.to;
      if (location.pathname.startsWith(to)) {
        selectedKey = item.key as string;
        break;
      }
    }
  }

  return (
    <Menu
      selectedKeys={[selectedKey]}
      mode="horizontal"
      inlineCollapsed={collapsed}
      items={items}
      className="bg-light_blue"
      style={{ border: 0, width: "100%" }}
    />
  );
};

export default DetailedClientMenu;
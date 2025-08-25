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
} from "@ant-design/icons";
import { ConfigProvider, Menu } from "antd";
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
      key: "contacts",
      icon: <ContactsOutlined />,
      label: <Link to={`/admin/company/contacts/${clientId}`}>Contacts</Link>,
    },
    {
      key: "actions",
      label: "Manage",
      icon: <SettingOutlined />,
      children: [
        {
          key: "edit-company-details",
          icon: <EditOutlined />,
          label: <Link to={`/admin/company/edit/${clientId}`}>Edit Company</Link>,
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
          label: <Link to={`/admin/company/notes/${clientId}`}>Add Note/Update</Link>,
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
    <ConfigProvider
    
      theme={{
        token: { borderRadius: 4 },
        components: {
          Menu: {
            itemColor: "#000",
            itemSelectedColor: "#E6F5FB",
            itemSelectedBg: "#1f72a6",
            itemHoverColor: "#000",
            itemHoverBg: "#fff",
            subMenuItemBg: "transparent"
          }
        }
      }}
      
    >
      <Menu
        selectedKeys={[selectedKey]}
        mode="horizontal"
        inlineCollapsed={collapsed}
        items={items}
        style={{ border: 0, width: "100%", backgroundColor: "#fff" }}
      />
    </ConfigProvider>

  );
};

export default DetailedClientMenu;
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Link, useLocation } from "@remix-run/react";
import { FC } from "react";

interface Props {
  user: {
    name: string;
    email: string;
  };
}

const UserMenu: FC<Props> = ({ user }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="w-60 rounded-md shadow bg-light_gray">
      <Link
        to="/user/profile"
        className={`px-4 py-2 flex items-center cursor-pointer text-black ${
          pathname.startsWith("/user/profile")
            ? "bg-high_blue text-white hover:text-white"
            : "hover:bg-base_blue hover:text-black text-black"
        }`}
      >
        <UserOutlined className="mr-2" />
        Profile
      </Link>

      <Link
        to="/settings"
        className={`px-4 py-2 flex items-center cursor-pointer text-black ${
          pathname.startsWith("/settings")
            ? "bg-high_blue text-white hover:text-white"
            : "hover:bg-base_blue hover:text-black text-black"
        }`}
      >
        <SettingOutlined className="mr-2" />
        Settings
      </Link>

      <Form method="post" action="/logout">
        <button
          type="submit"
          className="hover:bg-base_blue px-4 py-2 w-full flex items-center cursor-pointer text-black"
        >
          <LogoutOutlined className="mr-2" />
          Cerrar sesión
        </button>
      </Form>
    </div>
  );
};

export default UserMenu;
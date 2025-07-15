import { CrownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Form } from "@remix-run/react";
import { FC } from "react";

interface Props {
    user: {
        name: string;
        email: string;
    }
}
const UserMenu: FC<Props> = ({ user }) => (
    <div className="w-60 rounded-md shadow bg-light_gray">
        <div className="px-4 pt-3 pb-0 text-high_blue font-bold text-base">{user.name}</div>
        <div className="px-4 pb-3 text-high_blue text-sm">{user.email}</div>
        <hr className="border-gray-200 mb-1" />
        <div className="hover:bg-sky-50 hover:text-high_blue px-4 py-2 flex items-center cursor-pointer text-gray-700">
            <CrownOutlined className="mr-2" />
            Admin Mode
        </div>
        <div className="hover:bg-sky-50 hover:text-high_blue px-4 py-2 flex items-center cursor-pointer text-gray-700">
            <UserOutlined className="mr-2" />
            Profile
        </div>
        <div className="hover:bg-sky-50 hover:text-high_blue px-4 py-2 flex items-center cursor-pointer text-gray-700">
            <SettingOutlined className="mr-2" />
            Settings
        </div>
        <Form method="post" action="/logout">
            <button
                type="submit"
                className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 flex items-center"
            >
                <LogoutOutlined className="mr-2" />
                Cerrar sesión
            </button>
        </Form>
    </div>
);

export default UserMenu
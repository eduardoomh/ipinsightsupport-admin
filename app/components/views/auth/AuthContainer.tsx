import { FC } from "react";
import LoginForm from "./LoginForm";
import CreatePasswordForm from "./CreatePasswordForm";

interface Props {
    type: 'login' | 'reset_password' | 'create_password';
    data?: {
        email: string;
        id: string;
        type: 'USER' | 'CONTACT';
    }
}

const AuthContainer: FC<Props> = ({ type, data }) => {
    return (
        <section className="grid grid-cols-2 w-[1000px] h-[600px] border rounded shadow border-high_blue">
            <div className="bg-[#294a5f] flex items-center justify-center aspect-[499/598] w-full h-full">
                <img src="/sentinelux-login.jpeg" className="w-full h-full object-contain" />
            </div>
            <div className="p-8 flex items-center bg-white">
                {
                    type === 'login' ?
                        <LoginForm /> :
                        <CreatePasswordForm data={data as any} type={type} />
                }

            </div>

        </section>
    )
}

export default AuthContainer
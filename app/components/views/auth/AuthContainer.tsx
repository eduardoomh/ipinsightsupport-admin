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
        <section className="grid grid-cols-2 w-[1000px] h-[600px] mx-auto border rounded shadow border-high_blue">
            <div className="bg-light_blue flex flex-col justify-center items-center">
                <img src="/IP-Insight-Support-Logo.webp" width={400} />
                <h6 className="text-xl font-bold">{type === 'login' ? 'Sentinelux System' : type === 'reset_password' ? 'Reset your password' : 'Create your password'}</h6>
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
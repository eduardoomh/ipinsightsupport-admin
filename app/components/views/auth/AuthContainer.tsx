import { FC } from "react";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

interface Props {
    type: 'login' | 'reset_password';
    user?: {
        email: string;
        id: string;
    }
}

const AuthContainer: FC<Props> = ({ type, user }) => {
    return (
        <section className="grid grid-cols-2 w-[1000px] h-[600px] mx-auto border rounded shadow border-high_blue">
            <div className="bg-light_blue flex flex-col justify-center items-center">
                <img src="/IP-Insight-Support-Logo.webp" width={400} />
                <h6 className="text-xl font-bold">Sentinelux System</h6>
            </div>
            <div className="p-8 flex items-center bg-white">
                {
                    type === 'login' ? 
                        <LoginForm /> : 
                        <ResetPassword user={user as any} />
                }
                
            </div>
            
        </section>
    )
}

export default AuthContainer
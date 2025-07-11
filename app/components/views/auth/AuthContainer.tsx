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
        <section className="grid grid-cols-2 w-[1000px] h-[600px] mx-auto border rounded shadow">
            <div className="bg-gradient-to-br from-[#00abff] to-[#33bfff]" />
            <div className="p-8 flex items-center bg-light_gray">
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
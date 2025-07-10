import { FC } from "react";
import LoginForm from "./LoginForm";

interface Props {
    navigation: any;
}

const AuthContainer: FC<Props> = ({ navigation }) => {
    return (
        <section className="grid grid-cols-2 w-[1000px] h-[600px] mx-auto border rounded shadow">
            <div className="bg-gradient-to-br from-[#00abff] to-[#33bfff]" />
            <div className="p-8 flex items-center bg-light_gray">
                <LoginForm navigation={navigator} />
            </div>
            
        </section>
    )
}

export default AuthContainer
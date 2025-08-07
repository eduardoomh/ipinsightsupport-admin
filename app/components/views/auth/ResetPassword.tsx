import { Form, useNavigate } from "@remix-run/react";
import { LockOutlined } from "@ant-design/icons"
import { Button, Input, message, Typography } from "antd"
import { FC, useState } from "react";
import InputContainer from "./InputContainer";
const { Title } = Typography;

interface Props {
    user: {
        email: string;
        id: string;
    }
}
const LoginForm: FC<Props> = ({ user }) => {
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const repeatPassword = formData.get("repeat_password") as string;

        if (password.length < 6) {
            messageApi.error("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        if (password !== repeatPassword) {
            messageApi.error("Passwords do not match");
            setLoading(false);
            return;
        }

        formData.append("id", user?.id);

        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageApi.success("Password saved successfully");
            setLoading(false)
            setTimeout(() =>{
                 navigate("/login");
            },2000)
           
        } else {
            messageApi.error(data.error || "Failed to save your new password");
            setLoading(false)
        }

    };

    const backToLogin = () => {
        navigate("/login")
    }

    return (
        <div className="flex flex-col w-full h-auto">
            {contextHolder}
            <Title className="text-center" level={2}>Reset your password</Title>
            <Form method="post" className="space-y-4" onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                <InputContainer label="New Password">
                    <Input.Password
                        name="password"
                        placeholder="New Password"
                        prefix={<LockOutlined />}
                        size="large"
                        required
                    />
                </InputContainer>

                <InputContainer label="Repeat Password">
                    <Input.Password
                        name="repeat_password"
                        placeholder="Repeat password"
                        prefix={<LockOutlined />}
                        size="large"
                        required
                    />
                </InputContainer>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="bg-primary border border-[#4C87BE] hover:bg-[#4C87BE] transition-colors duration-200"
                    loading={loading}
                    block
                >
                    Save New Password
                </Button>
                <div className="flex justify-center text-lg">
                    <Typography
                        className="text-center text-base cursor-pointer"
                        onClick={backToLogin}>
                        Go back to login
                    </Typography>
                </div>
            </Form>
        </div>
    )
}

export default LoginForm
import { Form, useNavigate } from "@remix-run/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Input, message, Modal, Typography } from "antd"
import { FC, useState } from "react";
import InputContainer from "./InputContainer";
const { Title } = Typography;

const LoginForm: FC = () => {
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    /*
    const fetcher = useFetcher<LoginResponse>();

    useEffect(() => {
        if (fetcher.data?.error) {
            messageApi.error(fetcher.data.error);
        }
        if (fetcher.data?.success) {
            messageApi.success("Login successfully");
            // Aquí puedes redirigir manualmente si es necesario
            setTimeout(() => {
                window.location.href = "/dashboard";
                navigate("/dashboard");
            }, 100);
        }
    }, [fetcher.data, messageApi]);
    */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: formData,
            credentials: "include", // esto permite que cookies se guarden
        });

        const data = await response.json();

        if (data.success) {
            messageApi.success("Login successful");
            setLoading(false)
            navigate("/");
        } else {
            messageApi.error(data.error || "Login failed");
            setLoading(false)
        }

    };


    const handleRecoveryEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await response.json();
        console.log(data)
        if (data.success) {
            messageApi.success("Email sent successfully");
            setLoading(false)
            setOpenModal(false)
        } else {
            messageApi.error(data.error || "The email was not sent");
            setLoading(false)
        }

    };

    return (
        <div className="flex flex-col w-full h-auto">
            {contextHolder}
            <Title className="text-center" level={2}>Please Sign Up</Title>
            <Form method="post" className="space-y-4" onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                <InputContainer label="Email">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        prefix={<MailOutlined />}
                        size="large"
                        required
                    />
                </InputContainer>
                <InputContainer label="Password">
                    <Input.Password
                        name="password"
                        placeholder="Contraseña"
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
                    Sign In
                </Button>
                <div className="flex justify-center text-lg">
                    <Typography
                        className="text-center text-base cursor-pointer"
                        onClick={() => setOpenModal(true)}>
                        Forgot Password?
                    </Typography>
                </div>
            </Form>
            <Modal
                title="Change your password"
                centered
                open={openModal}
                onOk={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                footer={<></>}
            >
                <Form method="post" className="space-y-4" onSubmit={handleRecoveryEmail}>
                    <Typography>
                        Enter the email address linked to your account and you will receive an email with a link to reset your password.
                    </Typography>

                    <Input
                        name="email"
                        type="email"
                        placeholder="Type your email"
                        prefix={<MailOutlined />}
                        size="large"
                        required
                        className="mt-4 mb-4"
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="bg-primary border border-[#4C87BE] hover:bg-[#4C87BE] transition-colors duration-200"
                        loading={loading}
                        block
                    >
                        Send recovery email
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default LoginForm
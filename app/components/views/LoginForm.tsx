import { Form } from "@remix-run/react";
import { LockOutlined, MailOutlined } from "@ant-design/icons"
import { Alert, Button, Input, Typography } from "antd"
import { FC } from "react";
const { Title } = Typography;

interface Props {
    actionData: any;
    navigation: any;
}

const LoginForm: FC<Props> = ({ actionData, navigation }) => {

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <Title level={2}>Iniciar sesión</Title>

            {actionData?.error && (
                <Alert
                    message="Error"
                    description={actionData.error}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            )}

            <Form method="post" className="space-y-4" style={{ display: "grid", gap: 16 }}>
                <Input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    prefix={<MailOutlined />}
                    required
                />
                <Input.Password
                    name="password"
                    placeholder="Contraseña"
                    prefix={<LockOutlined />}
                    required
                />

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={navigation.state === "submitting"}
                    block
                >
                    {navigation.state === "submitting" ? "Ingresando..." : "Entrar"}
                </Button>
            </Form>
        </div>
    )
}

export default LoginForm
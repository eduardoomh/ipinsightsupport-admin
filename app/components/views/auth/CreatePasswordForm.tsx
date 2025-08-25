import { Form, useNavigate } from "@remix-run/react";
import { LockOutlined } from "@ant-design/icons";
import { Button, Input, message, Typography, Progress } from "antd";
import { FC, useState } from "react";
import InputContainer from "./InputContainer";

const { Text, Title } = Typography;

interface Props {
  type: 'login' | 'reset_password' | 'create_password';
  data: {
    email: string;
    id: string;
    type: 'USER' | 'CONTACT';
  };
}

const CreatePasswordForm: FC<Props> = ({ data, type }) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const passwordRules = [
    { regex: /.{8,}/, message: "At least 8 characters" },
    { regex: /[A-Z]/, message: "At least one uppercase letter" },
    { regex: /[a-z]/, message: "At least one lowercase letter" },
    { regex: /\d/, message: "At least one number" },
    { regex: /[^A-Za-z0-9]/, message: "At least one special character" },
  ];

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    passwordRules.forEach(rule => {
      if (rule.regex.test(pwd)) strength += 20;
    });
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const repeatPassword = formData.get("repeat_password") as string;

    const failedRule = passwordRules.find(rule => !rule.regex.test(newPassword));
    if (failedRule) {
      messageApi.error(`Password invalid: ${failedRule.message}`);
      setLoading(false);
      return;
    }

    if (newPassword !== repeatPassword) {
      messageApi.error("Passwords do not match");
      setLoading(false);
      return;
    }

    formData.append("id", data?.id);
    formData.append("type", data?.type);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      messageApi.success("Password saved successfully");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      messageApi.error(result.error || "Failed to save your new password");
      setLoading(false);
    }
  };

  const backToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-full h-auto">
      {contextHolder}
      <Title className="text-center" level={2}>{type === 'create_password' ? 'Create your password' : 'Reset your password'}</Title>
      <Form method="post" className="space-y-4" onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <InputContainer label="New Password">
          <Input.Password
            name="password"
            placeholder="New Password"
            prefix={<LockOutlined />}
            size="large"
            required
            value={password}
            onChange={handlePasswordChange}
          />

          {/* Barra de fuerza */}
          <div className="mt-2">
            <Progress
              percent={passwordStrength}
              showInfo={false}
              strokeColor={{
                '0%': '#ff4d4f',
                '50%': '#faad14',
                '100%': '#52c41a'
              }}
            />
            <Text type={passwordStrength === 100 ? "success" : "secondary"} style={{ fontSize: 12 }}>
              Password Strength: {passwordStrength === 100 ? "Strong" : "Weak"}
            </Text>
          </div>

          {/* Lista de reglas */}
          <ul className="mt-2" style={{ paddingLeft: 20, fontSize: 12 }}>
            {passwordRules.map(rule => (
              <li
                key={rule.message}
                style={{ color: rule.regex.test(password) ? "#52c41a" : "#ff4d4f" }}
              >
                {rule.message}
              </li>
            ))}
          </ul>
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
          className="bg-primary border border-[#4C87BE] hover:bg-[#4C87BE] transition-colors duration-200 rounded-lg"
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
  );
};

export default CreatePasswordForm;
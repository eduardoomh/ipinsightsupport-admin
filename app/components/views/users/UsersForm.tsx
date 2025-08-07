import { Button, Form, Input, Select, Switch } from "antd";

interface Props {
    user: any;
    handleSubmit: any;
    submitting: boolean;
    edit: boolean;
}

const UsersForm = ({ user, handleSubmit, submitting, edit }: Props) => {
    return (
        <Form
            layout="vertical"
            initialValues={user ?? {}}
            onFinish={handleSubmit}
            id="edit-user-form"
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter a name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter an email" }]}
            >
                <Input disabled={edit} />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: "Please enter a phone number" }]}
            >
                <Input />
            </Form.Item>

            {!edit && (
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: "Please enter a password" },
                        { min: 6, message: "Password must be at least 6 characters long" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            )}

            <Form.Item
                name="type"
                label="Rate Type"
                rules={[{ required: true, message: "Please select a rate type" }]}
            >
                <Select placeholder="Select a rate type">
                    <Select.Option value="engineering">Engineering</Select.Option>
                    <Select.Option value="architecture">Architecture</Select.Option>
                    <Select.Option value="senior_architecture">Senior Architecture</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="is_admin"
                label="Admin"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item
                name="is_active"
                label="Active"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item
                name="is_account_manager"
                label="Account Manager"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-primary"
                loading={submitting}
                block
            >
                Save Changes
            </Button>
        </Form>
    );
};

export default UsersForm;
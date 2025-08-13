import { Button, Form, Input, Select } from "antd";

interface Props {
    contact?: any;
    handleSubmit: (values: any) => void;
    submitting: boolean;
    clients?: { id: string; company: string }[];
    edit?: boolean;
    excludeClientField?: boolean;
}

const ContactForm = ({ contact, handleSubmit, submitting, clients = [], edit = false, excludeClientField = false }: Props) => {
    return (
        <Form
            layout="vertical"
            initialValues={contact ?? {}}
            onFinish={handleSubmit}
            id="client-form"
        >
            <Form.Item
                label="Contact Name"
                name="name"
                rules={[{ required: true, message: "Please enter the contact name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Contact Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter the contact email" },
                    { type: "email", message: "Invalid email format" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Contact Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter the contact phone number" }]}
            >
                <Input />
            </Form.Item>

            {
                !excludeClientField && (
                    <Form.Item
                        label="Client"
                        name="client_id"
                        rules={[{ required: true, message: "Please select a client" }]}
                    >
                        <Select
                            showSearch
                            allowClear={!edit}
                            placeholder={edit ? "Select a client" : "Select a client (optional)"}
                            optionFilterProp="label"
                            options={clients.map((client) => ({
                                label: client.company,
                                value: client.id,
                            }))}
                            filterOption={(input, option) =>
                                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                )
            }

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-primary"
                loading={submitting}
                block
            >
                {edit ? "Update Contact" : "Create Contact"}
            </Button>
        </Form>
    );
};

export default ContactForm;
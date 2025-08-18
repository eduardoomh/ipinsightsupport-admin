import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";

const { Option } = Select;

interface Props {
    client?: any;
    handleSubmit: (values: any) => void;
    submitting: boolean;
    edit?: boolean;
}

const TIMEZONES = [
    "EASTERN",
    "CENTRAL",
    "PACIFIC",
    "MOUNTAIN",
    "EUROPE",
    "ASIA",
    "AFRICA",
    "LATAM",
    "AUSTRALIA_NZ",
];

const ClientForm = ({ client, handleSubmit, submitting, edit = false }: Props) => {

    useEffect(() =>{
        console.log(client)
    },[client])
    return (
        <Form
            layout="vertical"
            initialValues={client ?? {}}
            onFinish={handleSubmit}
            id="client-form"
        >
            <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true, message: "Please enter the company name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="timezone"
                label="Timezone"
                rules={[{ required: true, message: "Please select a timezone" }]}
            >
                <Select placeholder="Select a timezone">
                    {TIMEZONES.map((tz) => (
                        <Option key={tz} value={tz}>
                            {tz.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {!edit && (
                <>
                    <Form.Item
                        label="Contact Name"
                        name={['contact', 'name']}
                        rules={[{ required: true, message: "Please enter the contact name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Contact Email"
                        name={['contact', 'email']}
                        rules={[
                            { required: true, message: "Please enter the contact email" },
                            { type: "email", message: "Invalid email format" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Contact Phone"
                        name={['contact', 'phone']}
                        rules={[{ required: true, message: "Please enter the contact phone number" }]}
                    >
                        <Input />
                    </Form.Item>
                </>
            )}

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-primary"
                loading={submitting}
                block
            >
                {edit ? "Update Company" : "Create Company"}
            </Button>
        </Form>
    );
};

export default ClientForm;
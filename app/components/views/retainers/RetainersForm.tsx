import { Button, Form, Input, InputNumber, DatePicker, Switch, Row, Col, Alert } from "antd";

interface Props {
    retainer?: any;
    handleSubmit: any;
    submitting: boolean;
}

const RetainerForm = ({ retainer, handleSubmit, submitting }: Props) => {
    const onFinish = (values: any) => {
        handleSubmit({
            ...values,
        });
    };

    return (
        <Form
            layout="vertical"
            initialValues={retainer ?? {}}
            onFinish={onFinish}
            id="edit-retainer-form"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: "Please enter an amount" }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            step={0.01}
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="date_activated"
                        label="Date Activated"
                        rules={[{ required: true, message: "Please select a date" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="note"
                label="Note"
            >
                <Input.TextArea rows={4} placeholder="Optional notes" />
            </Form.Item>

            <Form.Item
                name="is_credit"
                label="Is Credit"
                valuePropName="checked"
            >
                <Alert
                    message="If checked, this balance will be excluded from being counted as monetary revenue for reporting purposes."
                    type="info"
                    showIcon
                    style={{ marginBottom: 8 }}
                />
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
                Save Balance
            </Button>
        </Form>
    );
};

export default RetainerForm;
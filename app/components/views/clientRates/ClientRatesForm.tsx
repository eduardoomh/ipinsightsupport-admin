import { useEffect } from "react";
import { Button, Form, InputNumber } from "antd";

interface Props {
  clientRates?: any;
  handleSubmit: any;
  submitting: boolean;
  edit: boolean;
}

const ClientRatesForm = ({ clientRates, handleSubmit, submitting, edit }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (edit && clientRates) {
        console.log(clientRates, "vemos")
      form.setFieldsValue({
        engineeringRate: clientRates.engineeringRate ?? undefined,
        architectureRate: clientRates.architectureRate ?? undefined,
        seniorArchitectureRate: clientRates.seniorArchitectureRate ?? undefined,
      });
    }
  }, [edit, clientRates, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      id="client-rates-form"
    >
      <Form.Item
        name="engineeringRate"
        label="Engineering"
        rules={[{ required: true, message: "Please enter the engineering rate" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          stringMode
          placeholder="Enter engineering rate"
          disabled={submitting}
          addonAfter=".00/Hour"
        />
      </Form.Item>

      <Form.Item
        name="architectureRate"
        label="Architecture"
        rules={[{ required: true, message: "Please enter the architecture rate" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="Enter architecture rate"
          disabled={submitting}
          addonAfter=".00/Hour"
        />
      </Form.Item>

      <Form.Item
        name="seniorArchitectureRate"
        label="Senior Architecture"
        rules={[{ required: true, message: "Please enter the senior architecture rate" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="Enter senior architecture rate"
          disabled={submitting}
          addonAfter=".00/Hour"
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="bg-primary"
        loading={submitting}
        block
      >
        {edit ? "Update Rates" : "Create Rates"}
      </Button>
    </Form>
  );
};

export default ClientRatesForm;
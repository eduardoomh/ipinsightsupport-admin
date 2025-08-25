import { Button, Form, Input } from "antd";
import React from "react";
import TextEditor from "~/components/basics/TextEditor";

interface Props {
  handleSubmit: (values: any) => void;
  submitting: boolean;
}

const ClientStatusHistoryForm: React.FC<Props> = ({
  handleSubmit,
  submitting,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        title: "",
        note: "",
      }}
      onFinish={handleSubmit}
      id="client-status-history-form"
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please enter a title" }]}
      >
        <Input placeholder="Enter title" />
      </Form.Item>

      <Form.Item
        name="note"
        label="Note"
        rules={[{ required: true, message: "Please enter a note" }]}
      >
        <TextEditor
          height="32"
          value={form.getFieldValue("note") ?? ""}
          onChange={(val) => form.setFieldsValue({ note: val })}
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
        Add Note
      </Button>
    </Form>
  );
};

export default ClientStatusHistoryForm;
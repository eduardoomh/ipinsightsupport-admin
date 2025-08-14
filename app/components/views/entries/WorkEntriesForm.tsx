import { Button, Form, Input, DatePicker, Checkbox, Slider, Typography, Alert, Select } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { UsersI } from "~/interfaces/users.interface";

const { Text } = Typography;

interface Props {
  workEntry?: any;
  handleSubmit: (values: any) => void;
  submitting: boolean;
  edit?: boolean;
  users: UsersI[];
}

const WorkEntryForm = ({ workEntry, handleSubmit, submitting, edit = false, users }: Props) => {
  const [form] = Form.useForm();
  const [separateHours, setSeparateHours] = useState(false);

  const formatHours = (value: number) => {
    const num = Number(value ?? 0);
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    const h = `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
    const m = minutes > 0 ? ` and ${minutes} ${minutes === 1 ? "Minute" : "Minutes"}` : "";
    return h + m;
  };

  // Si vino spent pero no billed, arranca sincronizado
  useEffect(() => {
    if (workEntry?.hours_spent != null && workEntry?.hours_billed == null) {
      form.setFieldsValue({ hours_billed: workEntry.hours_spent });
    }
  }, [workEntry, form]);

  // Mantener billed sincronizado con spent si NO se separan
  const handleValuesChange = (changedValues: any) => {
    if (!separateHours && changedValues.hours_spent !== undefined) {
      form.setFieldsValue({ hours_billed: changedValues.hours_spent });
    }
  };

  // Al desmarcar separación, re-sincroniza billed con spent
  useEffect(() => {
    if (!separateHours) {
      const spent = form.getFieldValue("hours_spent");
      if (spent !== undefined) {
        form.setFieldsValue({ hours_billed: spent });
      }
    }
  }, [separateHours, form]);

  // Convertir fecha a ISO + asegurar billed correcto al enviar
  const onFinish = (values: any) => {
    const billedISO = values.billed_on ? dayjs(values.billed_on).toDate().toISOString() : null;
    const finalHoursBilled = separateHours ? values.hours_billed : values.hours_spent;

    handleSubmit({
      ...values,
      billed_on: billedISO,                    // ✅ 2025-08-02T06:59:36.165Z
      hours_billed: Number(finalHoursBilled),  // ✅ asegura número
      hours_spent: Number(values.hours_spent), // ✅ asegura número
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        user_id: workEntry?.user_id ?? undefined,
        // mejor no fijar 0 para que no “se quede” en 0 si el slider no cambia
        hours_spent: workEntry?.hours_spent ?? undefined,
        hours_billed: workEntry?.hours_billed ?? workEntry?.hours_spent ?? undefined,
        summary: workEntry?.summary ?? "",
        billed_on: workEntry?.billed_on ? dayjs(workEntry.billed_on) : null,
      }}
      onValuesChange={handleValuesChange}
      onFinish={onFinish}
      id="work-entry-form"
    >
      {/* Select de usuario */}
      <Form.Item
        name="user_id"
        label="User"
        rules={[{ required: true, message: "Please select a user" }]}
      >
        <Select placeholder="Select a user" optionFilterProp="children" showSearch>
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Billed On */}
      <Form.Item
        name="billed_on"
        label="Billed On"
        rules={[{ required: true, message: "Please select a billing date" }]}
      >
        {/* El valor real se convierte a ISO en onFinish */}
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>

      {/* Nota fuera del Form.Item para no romper el binding del Slider */}
      <Alert
        message="This should be the actual time spent on this entry. If you need to modify the time billed to the customer, you can separate the time billed vs time spent."
        type="info"
        showIcon
        style={{ marginBottom: 8 }}
      />

      {/* Time Spent (SOLO el Slider como hijo del Form.Item) */}
      <Form.Item
        name="hours_spent"
        label="Time Spent"
        // Evita usar 'required' + 0; usa validador que chequea número > 0
        rules={[
          {
            validator: (_, v) =>
              typeof v === "number" && v > 0
                ? Promise.resolve()
                : Promise.reject(new Error("Time Spent must be greater than 0")),
          },
        ]}
        validateTrigger="onChange"
        valuePropName="value" // explícito por claridad
      >
        <Slider min={0} max={12} step={0.25} tooltip={{ formatter: formatHours }} />
      </Form.Item>

      {/* Toggle de separación */}
      <Form.Item>
        <Checkbox checked={separateHours} onChange={(e) => setSeparateHours(e.target.checked)}>
          Declare different billed hours
        </Checkbox>
      </Form.Item>

      {/* Nota para billed */}
      {separateHours && (
        <Alert
          message="This should be the time billed to the customer."
          type="info"
          showIcon
          style={{ marginBottom: 8 }}
        />
      )}

      {/* Time Billed (solo existe cuando se separa; no hay segundo Form.Item duplicado) */}
      {separateHours && (
        <Form.Item
          name="hours_billed"
          label="Time Billed"
          rules={[
            {
              validator: (_, v) =>
                typeof v === "number" && v > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Time Billed must be greater than 0")),
            },
          ]}
          validateTrigger="onChange"
          valuePropName="value"
        >
          <Slider min={0} max={12} step={0.25} tooltip={{ formatter: formatHours }} />
        </Form.Item>
      )}

      <Form.Item
        name="summary"
        label="Summary"
        rules={[{ required: true, message: "Please enter a summary" }]}
      >
        <Input.TextArea rows={4} placeholder="Describe the work done..." />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="bg-primary"
        loading={submitting}
        block
      >
        {edit ? "Update Work Entry" : "Create Work Entry"}
      </Button>
    </Form>
  );
};

export default WorkEntryForm;
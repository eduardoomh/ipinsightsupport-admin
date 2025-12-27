import { Button, Form, DatePicker, Checkbox, Slider, Alert, Select } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { UsersI } from "~/interfaces/users.interface";
import TextEditor from "~/components/basics/TextEditor";
import { ClientI } from "~/interfaces/clients.interface";
import { WorkEntry } from '~/features/WorkEntries/Interfaces/workEntries.interface';

interface Props {
  workEntry?: any;
  handleSubmit: (values: any) => void;
  submitting: boolean;
  edit?: boolean;
  users: UsersI[];
  user?: UsersI;
  entry?: WorkEntry;
  company?: ClientI;
}

const WorkEntryForm = ({ workEntry, handleSubmit, submitting, edit = false, users, user, company }: Props) => {
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

  useEffect(() => {
    if (workEntry?.hours_billed != null && workEntry?.hours_spent == null) {
      form.setFieldsValue({ hours_spent: workEntry.hours_billed });
    }
  }, [workEntry, form]);

  const handleValuesChange = (changedValues: any) => {
    if (!workEntry && !separateHours && changedValues.hours_billed !== undefined) {
      form.setFieldsValue({ hours_spent: changedValues.hours_billed });
    }
  };

  useEffect(() => {
    if (!separateHours && !workEntry) {
      const billed = form.getFieldValue("hours_billed");
      if (billed !== undefined) {
        form.setFieldsValue({ hours_spent: billed });
      }
    }
  }, [separateHours, form]);

  const onFinish = (values: any) => {
    const billedISO = values.billed_on ? dayjs(values.billed_on).toDate().toISOString() : null;
    const finalHoursSpent = (separateHours || workEntry) ? values.hours_spent : values.hours_billed;

    handleSubmit({
      ...values,
      billed_on: billedISO,
      hours_billed: Number(values.hours_billed),
      hours_spent: Number(finalHoursSpent),
      billing_type: values.billing_type,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        user_id: workEntry?.user_id ?? undefined,
        hours_billed: workEntry?.hours_billed ?? undefined,
        hours_spent: workEntry?.hours_spent ?? workEntry?.hours_billed ?? undefined,
        summary: workEntry?.summary ?? "",
        billed_on: workEntry?.billed_on ? dayjs(workEntry.billed_on) : null,
        billing_type: workEntry?.billing_type ?? "HOURLY",
      }}
      onValuesChange={handleValuesChange}
      onFinish={onFinish}
      id="work-entry-form"
    >
      {
        workEntry?.billing_type === "MONTHLY_PLAN" && (
          <Alert
            message="This Work entry is billed by monthly plan, the Time Billed is required but it will not be used for billing."
            type="warning"
            showIcon
            style={{ marginBottom: 8 }}
          />
        )
      }
      {
        (company?.billing_type === "MONTHLY_PLAN") && (
          <Alert
            message="This company is billed by monthly plan, the Time Billed is required but it will not be used for billing."
            type="warning"
            showIcon
            style={{ marginBottom: 8 }}
          />
        )
      }
      {
        !workEntry && (
          <Form.Item
            name="user_id"
            label="User"
            rules={[{ required: true, message: "Please select a user" }]}
            initialValue={user?.id}
          >
            <Select
              placeholder="Select a user"
              optionFilterProp="children"
              showSearch
              disabled={!!user}
            >
              {(user ? [user] : users).map((u) => (
                <Select.Option key={u.id} value={u.id}>
                  {u.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
      }
      {/* Billed On */}
      <Form.Item
        name="billed_on"
        label="Billed On"
        rules={[{ required: true, message: "Please select a billing date" }]}
      >
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>

      <Alert
        message="This should be the time billed to the customer. If you need to also track actual time spent, you can separate them."
        type="info"
        showIcon
        style={{ marginBottom: 8 }}
      />

      <Form.Item
        name="hours_billed"
        label="Time Billed"
        required
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

      {
        !workEntry && (
          <Form.Item>
            <Checkbox checked={separateHours} onChange={(e) => setSeparateHours(e.target.checked)}>
              Declare different spent hours
            </Checkbox>
          </Form.Item>
        )
      }

      {(separateHours || workEntry) && (
        <>
          <Alert
            message="This should be the actual time spent on this entry."
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          <Form.Item
            name="hours_spent"
            label="Time Spent"
            rules={[
              {
                validator: (_, v) =>
                  typeof v === "number" && v > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Time Spent must be greater than 0")),
              },
            ]}
            validateTrigger="onChange"
            valuePropName="value"
          >
            <Slider min={0} max={12} step={0.25} tooltip={{ formatter: formatHours }} />
          </Form.Item>
        </>
      )}

      <Form.Item
        name="summary"
        label="Summary"
        rules={[{ required: true, message: "Please enter a summary" }]}
        initialValue={workEntry?.summary ?? ""}
      >
        <TextEditor
          height="32"
          value={form.getFieldValue("summary") ?? ""}
          onChange={(val) => form.setFieldsValue({ summary: val })}
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
        {edit ? "Update Work Entry" : "Create Work Entry"}
      </Button>
    </Form>
  );
};

export default WorkEntryForm;
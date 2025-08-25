import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";

const { Option } = Select;

interface User {
  id: string;
  name: string;
}

interface Props {
  client?: any;
  handleSubmit: (values: any) => void;
  submitting: boolean;
  edit?: boolean;
  admin?: boolean;
  users: User[]; // Lista de usuarios para seleccionar como account_manager
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

export const CLIENT_STATUSES = [
  "ADHOC",
  "IN_PROGRESS",
  "ARCHIVE",
  "WAITING_ON_AM",
  "WAITING_ON_CLIENT",
  "TRANSFER",
];

const CompanyForm = ({
  client,
  handleSubmit,
  submitting,
  edit = false,
  users,
  admin = true,
}: Props) => {
  useEffect(() => {
    console.log(client, users);
  }, [client, users]);

  // Validar si el account_manager_id existe en la lista de usuarios
  const initialAccountManagerId = users.some((u) => u.id === client?.account_manager_id)
    ? client?.account_manager_id
    : undefined;

  // Si no es admin, limitar las opciones de status
  const statusOptions = admin
    ? CLIENT_STATUSES
    : ["IN_PROGRESS", "ADHOC", "WAITING_ON_AM", "TRANSFER"];

  return (
    <Form
      layout="vertical"
      initialValues={{
        ...client,
        account_manager_id: initialAccountManagerId,
      }}
      onFinish={handleSubmit}
      id="client-form"
    >
      {admin && (
        <>
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
                  {tz
                    .replace("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item
        name="currentStatus"
        label="Current Status"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select placeholder="Select a status">
          {statusOptions.map((status) => (
            <Option key={status} value={status}>
              {status
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {admin && (
        <Form.Item
          name="account_manager_id"
          label="Account Manager"
          rules={[{ required: false }]}
        >
          <Select placeholder="Select an account manager" allowClear>
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
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

export default CompanyForm;
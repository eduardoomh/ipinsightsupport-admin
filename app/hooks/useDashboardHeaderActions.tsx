import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Button } from 'antd';

export function useDashboardHeaderActions(path: string, label: string) {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      className="bg-primary"
      icon={<PlusOutlined />}
      onClick={() => navigate(path)}
    >
      {label}
    </Button>
  );
}
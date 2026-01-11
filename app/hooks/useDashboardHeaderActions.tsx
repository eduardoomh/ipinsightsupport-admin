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
      onClick={() => { console.log("click", path) 
        navigate(path)}}
    >
      {label}
    </Button>
  );
}
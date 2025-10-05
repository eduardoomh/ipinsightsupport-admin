import { useNavigate, useParams } from "@remix-run/react";
import { Modal, message, Skeleton, Card, Table } from "antd";
import { useEffect, useState } from "react";
import { ObjectInspector } from "react-inspector";
import { LogI } from "~/components/views/logs/utils/logTable.interface";

export default function InfoLogModal() {
  const { logId } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState<LogI | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLog = async () => {
    try {
      const res = await fetch(`/api/logs/${logId}`);
      if (!res.ok) throw new Error("Failed to fetch log");
      const data = await res.json();
      setLog(data);
    } catch (err) {
      message.error("Failed to load log data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [logId]);

  const handleClose = () => navigate("/admin/advanced/logs");

  const columns = [
    { title: "Field", dataIndex: "field", key: "field", width: 150 },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const dataSource = log
    ? [
        { key: "1", field: "ID", value: log.id },
        { key: "2", field: "Source", value: log.source },
        { key: "3", field: "Level", value: log.level },
        { key: "4", field: "Message", value: log.message },
        { key: "5", field: "Created At", value: new Date(log.createdAt).toLocaleString() },
      ]
    : [];

  return (
    <Modal
      title="Log Info"
      open={true}
      onCancel={handleClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      {loading ? (
        <div className="p-4">
          <Card bordered className="mb-6" style={{ borderColor: "#d9d9d9" }}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      ) : log ? (
        <div className="p-4 space-y-6">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              size="small"
              rowKey="key"
              bordered
            />

          <Card title="Details (JSON)" bordered style={{ borderColor: "#d9d9d9" }}>
            {log.details ? (
              <ObjectInspector
                data={typeof log.details === "string" ? JSON.parse(log.details) : log.details}
                expandLevel={1}
                showNonenumerable={false}
              />
            ) : (
              <p>No details available</p>
            )}
          </Card>
        </div>
      ) : (
        <div className="text-center text-red-500">Log not found</div>
      )}
    </Modal>
  );
}
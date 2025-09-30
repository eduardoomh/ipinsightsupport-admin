// components/reports/ReportOptions.tsx
import { useState, useEffect } from "react";
import { Button, Modal, Space, Tag, DatePicker } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface Props {
  dateRange: [Dayjs, Dayjs];
  setDateRange: (val: [Dayjs, Dayjs]) => void;
  handleApplyFilter: () => void;
}

export default function ReportActions({
  dateRange,
  setDateRange,
  handleApplyFilter,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar con el mes actual si no hay fechas
  useEffect(() => {
    if (!dateRange) {
      const startOfMonth = dayjs().startOf("month");
      const endOfMonth = dayjs().endOf("month");
      setDateRange([startOfMonth, endOfMonth]);
    }
  }, [dateRange, setDateRange]);

  return (
    <Space>
      {/* Botón abrir modal */}
      <Button icon={<FilterOutlined />} onClick={() => setIsModalOpen(true)}>
        Filter by dates
      </Button>

      {/* Mostrar tag con el rango actual */}
      {dateRange && (
        <Tag color="green">
          {`${dateRange[0].format("DD/MM/YYYY")} - ${dateRange[1].format(
            "DD/MM/YYYY"
          )}`}
        </Tag>
      )}

      {/* Modal de filtro de fechas */}
      <Modal
        title="Select date range"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          handleApplyFilter();
          setIsModalOpen(false);
        }}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              setDateRange(dates ? [dates[0]!, dates[1]!] : dateRange)
            }
            style={{ width: "100%" }}
          />
        </Space>
      </Modal>
    </Space>
  );
}
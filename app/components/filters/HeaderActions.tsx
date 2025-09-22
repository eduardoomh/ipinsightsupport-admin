// components/work-entries/WorkEntriesHeaderActions.tsx
import { useState, ReactNode } from "react";
import { Button, Modal, Tag, Space, DatePicker, Select } from "antd";
import { FilterOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import DownloadButton from "./DownloadMenu";
import { useNavigate } from "@remix-run/react";

const { RangePicker } = DatePicker;

interface Props {
    title: string;
    path: string;
    fileName: string;
    selectedFilter: "recent" | "date" | null;
    setSelectedFilter: (val: "recent" | "date" | null) => void;
    dateRange: [Dayjs, Dayjs] | null;
    setDateRange: (val: [Dayjs, Dayjs] | null) => void;
    handleApplyFilter: () => void;
    handleResetFilter: () => void;
    createButton?: {
        label: string;
        path: string;
    }; // Nuevo prop para botón de creación
}

export default function HeaderActions({
    title,
    path,
    fileName,
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    handleApplyFilter,
    handleResetFilter,
    createButton,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
      const navigate = useNavigate();

    return (
        <Space>
            {/* Botón de crear si existe */}
            {createButton && (
                <Button
                    type="primary"
                    className="bg-primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(createButton.path)}
                >
                    {createButton.label}
                </Button>
            )}

            {/* Botón de filtros */}
            <Button icon={<FilterOutlined />} onClick={() => setIsModalOpen(true)}>
                Filtrar
            </Button>

            {/* Botón de descarga */}
            <DownloadButton
                path={path}
                fileName={fileName}
                selectedFilter={selectedFilter}
                dateRange={dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : null}
            />

            {/* Tags de filtros activos */}
            {selectedFilter && (
                <>
                    {selectedFilter === "recent" && (
                        <Tag color="blue" closable onClose={handleResetFilter}>
                            Más recientes
                        </Tag>
                    )}
                    {selectedFilter === "date" && dateRange && (
                        <Tag color="green" closable onClose={handleResetFilter}>
                            {`Rango: ${dateRange[0].format("DD/MM/YYYY")} - ${dateRange[1].format(
                                "DD/MM/YYYY"
                            )}`}
                        </Tag>
                    )}
                    <Button type="text" icon={<CloseCircleOutlined />} onClick={handleResetFilter}>
                        Reset
                    </Button>
                </>
            )}

            {/* Modal de filtros */}
            <Modal
                title={title}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    handleApplyFilter();
                    setIsModalOpen(false);
                }}
                destroyOnClose
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Select
                        value={selectedFilter || undefined}
                        onChange={(val) => setSelectedFilter(val as "recent" | "date")}
                        placeholder="Selecciona un filtro"
                        style={{ width: "100%" }}
                    >
                        <Select.Option value="recent">Más recientes</Select.Option>
                        <Select.Option value="date">Rango de fechas</Select.Option>
                    </Select>

                    {selectedFilter === "date" && (
                        <RangePicker
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : null)}
                            style={{ width: "100%" }}
                        />
                    )}
                </Space>
            </Modal>
        </Space>
    );
}
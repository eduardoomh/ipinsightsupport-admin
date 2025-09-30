// components/work-entries/WorkEntriesHeaderActions.tsx
import { useState, useEffect } from "react";
import { Button, Modal, Tag, Space, DatePicker, Select } from "antd";
import {
    FilterOutlined,
    CloseCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Dayjs } from "dayjs";
import DownloadButton from "./DownloadMenu";
import { useNavigate } from "@remix-run/react";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

const { RangePicker } = DatePicker;

interface Company {
    id: string;
    company: string;
}

interface User {
    id: string;
    name: string;
}

export enum ClientStatus {
    ADHOC = "ADHOC",
    IN_PROGRESS = "IN_PROGRESS",
    ARCHIVE = "ARCHIVE",
    WAITING_ON_AM = "WAITING_ON_AM",
    WAITING_ON_CLIENT = "WAITING_ON_CLIENT",
    TRANSFER = "TRANSFER",
}

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
    };

    // 🔥 filtros opcionales
    enableCompanyFilter?: boolean;
    companyId?: string | null;
    setCompanyId?: (val: string | null) => void;

    enableUserFilter?: boolean;
    userId?: string | null;
    setUserId?: (val: string | null) => void;

    isCredit?: boolean | null;
    setIsCredit?: (val: boolean | null) => void;

    companyStatus?: ClientStatus | null;
    setCompanyStatus?: (val: ClientStatus | null) => void;
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
    enableCompanyFilter = false,
    companyId,
    setCompanyId,
    enableUserFilter = false,
    userId,
    setUserId,
    isCredit,
    setIsCredit,
    companyStatus,
    setCompanyStatus,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    // Cargar compañías
    useEffect(() => {
        if (!enableCompanyFilter && !companyId) return;

        let mounted = true;
        fetch("/api/clients?fields=id,company&take=1000")
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;
                const list: Company[] = data?.clients || data?.items || data || [];
                setCompanies(Array.isArray(list) ? list : []);
            })
            .catch((err) => {
                console.error("Error fetching companies", err);
                setCompanies([]);
            });

        return () => {
            mounted = false;
        };
    }, [enableCompanyFilter, companyId]);

    // Cargar usuarios
    useEffect(() => {
        if (!enableUserFilter && !userId) return;

        let mounted = true;
        fetch("/api/users?take=1000&fields=id,name")
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;
                const list: User[] = data?.users || data?.items || data || [];
                setUsers(Array.isArray(list) ? list : []);
            })
            .catch((err) => {
                console.error("Error fetching users", err);
                setUsers([]);
            });

        return () => {
            mounted = false;
        };
    }, [enableUserFilter, userId]);

    // Labels seleccionados
    const selectedCompany = companyId
        ? companies.find((c) => c.id === companyId)
        : undefined;
    const companyLabel = selectedCompany?.company ?? companyId ?? undefined;

    const selectedUser = userId ? users.find((u) => u.id === userId) : undefined;
    const userLabel = selectedUser?.name ?? userId ?? undefined;

    const debitLabel =
        setIsCredit && isCredit === true
            ? "Crédito"
            : setIsCredit && isCredit === false
                ? "Débito"
                : undefined;

    const statusLabel =
        setCompanyStatus && companyStatus
            ? getClientStatusLabel(companyStatus as ClientStatus)
            : undefined;

    return (
        <Space>
            {/* Botón crear */}
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

            {/* Botón abrir modal */}
            <Button icon={<FilterOutlined />} onClick={() => setIsModalOpen(true)}>
                Filtrar
            </Button>

            {/* Botón descargar */}
            <DownloadButton
                path={path}
                fileName={fileName}
                selectedFilter={selectedFilter}
                isCredit={isCredit}
                companyStatus={companyStatus}
                clientId={companyId}
                userId={userId}
                dateRange={
                    dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : null
                }
            />

            {/* Tags activos */}
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
            {companyLabel && (
                <Tag color="purple" closable onClose={() => setCompanyId?.(null)}>
                    {companyLabel}
                </Tag>
            )}
            {userLabel && (
                <Tag color="volcano" closable onClose={() => setUserId?.(null)}>
                    {userLabel}
                </Tag>
            )}
            {debitLabel && setIsCredit && (
                <Tag color="cyan" closable onClose={() => setIsCredit(null)}>
                    {debitLabel}
                </Tag>
            )}
            {statusLabel && setCompanyStatus && (
                <Tag color="gold" closable onClose={() => setCompanyStatus(null)}>
                    {statusLabel}
                </Tag>
            )}

            {(selectedFilter ||
                companyId ||
                userId ||
                (setIsCredit && isCredit !== undefined) ||
                (setCompanyStatus && companyStatus)) && (
                    <Button
                        type="text"
                        icon={<CloseCircleOutlined />}
                        onClick={handleResetFilter}
                    >
                        Reset
                    </Button>
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
                    {/* Filtro base */}
                    <Select
                        value={selectedFilter || undefined}
                        onChange={(val) => setSelectedFilter(val as "recent" | "date")}
                        placeholder="Select a filter"
                        style={{ width: "100%" }}
                    >
                        <Select.Option value="recent">Most recent</Select.Option>
                        <Select.Option value="date">Date range</Select.Option>
                    </Select>

                    {selectedFilter === "date" && (
                        <RangePicker
                            value={dateRange}
                            onChange={(dates) =>
                                setDateRange(dates ? [dates[0], dates[1]] : null)
                            }
                            style={{ width: "100%" }}
                        />
                    )}

                    {/* Filtro compañías */}
                    {enableCompanyFilter && (
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select a company"
                            optionFilterProp="children"
                            value={companyId || undefined}
                            onChange={(val) => setCompanyId?.(val || null)}
                            style={{ width: "100%" }}
                        >
                            {companies.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.company}
                                </Select.Option>
                            ))}
                        </Select>
                    )}

                    {/* Filtro usuarios */}
                    {enableUserFilter && (
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select a user"
                            optionFilterProp="children"
                            value={userId || undefined}
                            onChange={(val) => setUserId?.(val || null)}
                            style={{ width: "100%" }}
                        >
                            {users.map((u) => (
                                <Select.Option key={u.id} value={u.id}>
                                    {u.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}

                    {/* Filtro is_debit */}
                    {setIsCredit && (
                        <Select
                            allowClear
                            placeholder="Select a balance type"
                            value={
                                isCredit === true ? "true" : isCredit === false ? "false" : undefined
                            }
                            onChange={(val) =>
                                setIsCredit(
                                    val === "true" ? true : val === "false" ? false : null
                                )
                            }
                            style={{ width: "100%" }}
                        >
                            <Select.Option value="true">Credit</Select.Option>
                            <Select.Option value="false">Debit</Select.Option>
                        </Select>
                    )}

                    {/* Filtro company status */}
                    {setCompanyStatus && (
                        <Select
                            allowClear
                            placeholder="Select a company status"
                            value={companyStatus || undefined}
                            onChange={(val) => setCompanyStatus(val as ClientStatus)}
                            style={{ width: "100%" }}
                        >
                            {Object.values(ClientStatus).map((status) => (
                                <Select.Option key={status} value={status}>
                                    {status.replace(/_/g, " ")}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Space>
            </Modal>
        </Space>
    );
}
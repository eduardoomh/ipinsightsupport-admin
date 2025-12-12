import { useState, useEffect } from "react";
import { 
    Button, Modal, Tag, Space, DatePicker, Select, 
    Segmented, Typography, Row, Col, Card 
} from "antd";
import {
    FilterOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    CalendarOutlined,
    UserOutlined,
    BankOutlined,
    WalletOutlined,
    FlagOutlined
} from "@ant-design/icons";
import { Dayjs } from "dayjs";
import DownloadButton from "./DownloadMenu";
import { useNavigate, useFetcher } from "@remix-run/react";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// --- Interfaces ---

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

    // Filtros opcionales
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

// --- Componente ---

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
    const navigate = useNavigate();

    // 1. Data Fetching con Remix (useFetcher)
    const companyFetcher = useFetcher<{ clients?: Company[]; items?: Company[] }>();
    const userFetcher = useFetcher<{ users?: User[]; items?: User[] }>();

    useEffect(() => {
        if (enableCompanyFilter && companyFetcher.state === "idle" && !companyFetcher.data) {
            companyFetcher.load("/api/clients?fields=id,company&take=1000");
        }
    }, [enableCompanyFilter, companyFetcher]);

    useEffect(() => {
        if (enableUserFilter && userFetcher.state === "idle" && !userFetcher.data) {
            userFetcher.load("/api/users?take=1000&fields=id,name");
        }
    }, [enableUserFilter, userFetcher]);

    // Extracción segura de datos
    const companies = companyFetcher.data?.clients || companyFetcher.data?.items || [];
    const users = userFetcher.data?.users || userFetcher.data?.items || [];
    const isLoadingCompanies = companyFetcher.state === "loading";
    const isLoadingUsers = userFetcher.state === "loading";

    // --- Lógica de Etiquetas (Tags) y Conteo ---
    
    // Función auxiliar para generar lista de tags activos (usada tanto en modal como fuera)
    const getActiveTagsData = () => {
        const tags = [];

        // Filtro Tiempo
        if (selectedFilter === "recent") {
            tags.push({ key: 'recent', label: 'Más Recientes', color: 'blue', onRemove: () => setSelectedFilter(null) });
        } else if (selectedFilter === "date" && dateRange) {
            tags.push({ 
                key: 'date', 
                label: `${dateRange[0].format("DD MMM")} - ${dateRange[1].format("DD MMM")}`, 
                color: 'blue', 
                onRemove: () => { setDateRange(null); setSelectedFilter(null); } 
            });
        }

        // Filtro Compañía
        if (companyId) {
            const name = companies.find(c => c.id === companyId)?.company || 'Compañía';
            tags.push({ key: 'company', label: name, color: 'purple', onRemove: () => setCompanyId?.(null) });
        }

        // Filtro Usuario
        if (userId) {
            const name = users.find(u => u.id === userId)?.name || 'Usuario';
            tags.push({ key: 'user', label: name, color: 'volcano', onRemove: () => setUserId?.(null) });
        }

        // Filtro Balance
        if (isCredit !== undefined && isCredit !== null) {
            tags.push({ 
                key: 'credit', 
                label: isCredit ? 'Crédito' : 'Débito', 
                color: 'cyan', 
                onRemove: () => setIsCredit?.(null) 
            });
        }

        // Filtro Estatus
        if (companyStatus) {
            tags.push({ 
                key: 'status', 
                label: getClientStatusLabel(companyStatus), 
                color: 'gold', 
                onRemove: () => setCompanyStatus?.(null) 
            });
        }

        return tags;
    };

    const activeTags = getActiveTagsData();
    const activeCount = activeTags.length;

    // --- Render ---

    return (
        <div className="w-full">
            {/* 1. Header Superior: Título y Botones Principales */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <Title level={4} style={{ margin: 0 }}>{title}</Title>
                
                <Space wrap>
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
                    
                    <DownloadButton
                        path={path}
                        fileName={fileName}
                        selectedFilter={selectedFilter}
                        isCredit={isCredit}
                        companyStatus={companyStatus}
                        clientId={companyId}
                        userId={userId}
                        dateRange={dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : null}
                    />
                    
                    {/* Botón Trigger de Filtros */}
                    <Button 
                        icon={<FilterOutlined />} 
                        onClick={() => setIsModalOpen(true)}
                        type={activeCount > 0 ? "default" : "dashed"}
                        className={activeCount > 0 ? "border-blue-500 text-blue-600 font-medium" : ""}
                    >
                        Filtros 
                        {activeCount > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {activeCount}
                            </span>
                        )}
                    </Button>

                    {activeCount > 0 && (
                         <Button
                            type="text"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={handleResetFilter}
                        >
                            Limpiar
                        </Button>
                    )}
                </Space>
            </div>

            {/* 2. Barra de Tags Externa (Estado Actual) */}
            {activeCount > 0 && (
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100 flex flex-wrap gap-2 items-center text-sm mb-4">
                    <Text type="secondary" className="mr-2 text-xs uppercase font-semibold">
                        <FilterOutlined /> Activos:
                    </Text>
                    {activeTags.map(tag => (
                        <Tag 
                            key={tag.key} 
                            color={tag.color} 
                            closable 
                            onClose={tag.onRemove}
                        >
                            {tag.label}
                        </Tag>
                    ))}
                </div>
            )}

            {/* 3. Modal de Configuración (Estilo Premium) */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <FilterOutlined /> <span>Filtros Avanzados</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    handleApplyFilter();
                    setIsModalOpen(false);
                }}
                okText={`Aplicar Filtros ${activeCount > 0 ? `(${activeCount})` : ''}`}
                width={650}
                destroyOnClose
                styles={{ body: { paddingBottom: 0 } }} 
            >
                <Space direction="vertical" size="large" className="w-full py-4">
                    
                    {/* A. Resumen en Vivo dentro del Modal */}
                    {activeCount > 0 ? (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <Text type="secondary" className="text-xs font-bold uppercase tracking-wider text-blue-800">
                                    Resumen de Selección:
                                </Text>
                                <Button 
                                    type="link" 
                                    size="small" 
                                    danger 
                                    onClick={handleResetFilter} 
                                    style={{ padding: 0, height: 'auto' }}
                                >
                                    Limpiar todo
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activeTags.map(tag => (
                                    <Tag 
                                        key={`modal-${tag.key}`} 
                                        color={tag.color} 
                                        closable 
                                        onClose={tag.onRemove}
                                        className="m-0"
                                    >
                                        {tag.label}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                            No hay filtros seleccionados.
                        </div>
                    )}

                    {/* B. Sección de Tiempo */}
                    <div className="bg-white">
                        <Text strong className="block mb-3 text-gray-700 text-base">
                            <CalendarOutlined className="mr-2 text-blue-500"/> Periodo
                        </Text>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Segmented
                                block
                                size="large"
                                options={[
                                    { label: 'Recientes (Últimos)', value: 'recent', icon: <FilterOutlined /> },
                                    { label: 'Por Fecha', value: 'date', icon: <CalendarOutlined /> },
                                ]}
                                value={selectedFilter || 'recent'}
                                onChange={(val) => setSelectedFilter(val as "recent" | "date")}
                                className="mb-3"
                            />

                            {selectedFilter === "date" && (
                                <RangePicker
                                    value={dateRange}
                                    onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : null)}
                                    style={{ width: "100%" }}
                                    size="middle"
                                    placeholder={['Fecha inicio', 'Fecha fin']}
                                />
                            )}
                        </div>
                    </div>

                    {/* C. Sección de Criterios (Grid) */}
                    {(enableCompanyFilter || enableUserFilter || setIsCredit || setCompanyStatus) && (
                        <div className="bg-white">
                            <Text strong className="block mb-3 text-gray-700 text-base">
                                <FilterOutlined className="mr-2 text-purple-500"/> Criterios
                            </Text>
                            
                            <Row gutter={[16, 16]}>
                                {/* Cliente */}
                                {enableCompanyFilter && (
                                    <Col span={12}>
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                                <BankOutlined className="mr-1"/> Cliente
                                            </label>
                                            <Select
                                                variant="borderless"
                                                allowClear
                                                showSearch
                                                placeholder="Seleccionar..."
                                                optionFilterProp="children"
                                                loading={isLoadingCompanies}
                                                value={companyId || undefined}
                                                onChange={(val) => setCompanyId?.(val || null)}
                                                style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                                                filterOption={(input, option) =>
                                                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {companies.map((c) => (
                                                    <Select.Option key={c.id} value={c.id}>{c.company}</Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                )}

                                {/* Usuario */}
                                {enableUserFilter && (
                                    <Col span={12}>
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                                <UserOutlined className="mr-1"/> Usuario
                                            </label>
                                            <Select
                                                variant="borderless"
                                                allowClear
                                                showSearch
                                                placeholder="Seleccionar..."
                                                optionFilterProp="children"
                                                loading={isLoadingUsers}
                                                value={userId || undefined}
                                                onChange={(val) => setUserId?.(val || null)}
                                                style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                                                filterOption={(input, option) =>
                                                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {users.map((u) => (
                                                    <Select.Option key={u.id} value={u.id}>{u.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                )}

                                {/* Balance */}
                                {setIsCredit && (
                                    <Col span={12}>
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                                <WalletOutlined className="mr-1"/> Balance
                                            </label>
                                            <Select
                                                variant="borderless"
                                                allowClear
                                                placeholder="Todos"
                                                value={isCredit === true ? "true" : isCredit === false ? "false" : undefined}
                                                onChange={(val) => setIsCredit(val === "true" ? true : val === "false" ? false : null)}
                                                style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                                            >
                                                <Select.Option value="true">Crédito</Select.Option>
                                                <Select.Option value="false">Débito</Select.Option>
                                            </Select>
                                        </div>
                                    </Col>
                                )}

                                {/* Estatus */}
                                {setCompanyStatus && (
                                    <Col span={12}>
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                                <FlagOutlined className="mr-1"/> Estatus
                                            </label>
                                            <Select
                                                variant="borderless"
                                                allowClear
                                                placeholder="Cualquiera"
                                                value={companyStatus || undefined}
                                                onChange={(val) => setCompanyStatus(val as ClientStatus)}
                                                style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                                            >
                                                {Object.values(ClientStatus).map((status) => (
                                                    <Select.Option key={status} value={status}>
                                                        {getClientStatusLabel(status)}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    )}
                </Space>
            </Modal>
        </div>
    );
}
// components/work-entries/header-actions/EntityFilters.tsx
import { Row, Col, Select } from "antd";
import { BankOutlined, UserOutlined } from "@ant-design/icons";
import { Company, User } from "./types";
import { FilterValues, FilterActions } from "~/hooks/useFilters";
import { OptionalFilter } from ".";
interface Props {
    // Visibilidad
    extraFilters: OptionalFilter[];
    // Datos y Acciones (Objetos completos)
    filterValues: FilterValues;
    filterActions: FilterActions;
    // Datos externos (Fetchers)
    companies: Company[];
    isLoadingCompanies: boolean;
    users: User[];
    isLoadingUsers: boolean;
}

export const EntityFilters = ({
    extraFilters,
    filterValues,
    filterActions,
    companies,
    isLoadingCompanies,
    users,
    isLoadingUsers
}: Props) => {
    
    // Helper para verificar la lista blanca
    const show = (filter: OptionalFilter) => extraFilters.includes(filter);

    // Si no hay nada que mostrar, no renderizamos la fila
    if (!show('company') && !show('user')) return null;

    return (
        <Row gutter={[16, 16]}>
            {/* Filtro de Compañía */}
            {show('company') && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <BankOutlined className="mr-1" /> Company
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            showSearch
                            placeholder="Select client..."
                            optionFilterProp="children"
                            loading={isLoadingCompanies}
                            value={filterValues.companyId || undefined}
                            onChange={(val) => filterActions.setCompanyId(val || null)}
                            style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                            filterOption={(input, option) =>
                                (option?.children as unknown as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {companies.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.company}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </Col>
            )}

            {/* Filtro de Usuario */}
            {show('user') && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <UserOutlined className="mr-1" /> User
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            showSearch
                            placeholder="Select user..."
                            optionFilterProp="children"
                            loading={isLoadingUsers}
                            value={filterValues.userId || undefined}
                            onChange={(val) => filterActions.setUserId(val || null)}
                            style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                            filterOption={(input, option) =>
                                (option?.children as unknown as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {users.map((u) => (
                                <Select.Option key={u.id} value={u.id}>
                                    {u.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </Col>
            )}
        </Row>
    );
};
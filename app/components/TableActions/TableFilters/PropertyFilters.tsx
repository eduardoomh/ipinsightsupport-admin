// components/work-entries/header-actions/PropertyFilters.tsx
import { Row, Col, Select } from "antd";
import { WalletOutlined, FlagOutlined } from "@ant-design/icons";
import { ClientStatus } from "./types";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";
import { OptionalFilter } from ".";
import { FilterActions, FilterValues } from "~/hooks/useFilters";

interface Props {
    filterValues: FilterValues;
    filterActions: FilterActions;
    extraFilters: OptionalFilter[];
}

export const PropertyFilters = ({ 
    filterValues,
    filterActions,
    extraFilters 
}: Props) => {
    
    // Helper para verificar la lista blanca
    const show = (filter: OptionalFilter) => extraFilters.includes(filter);

    // Si no hay nada que mostrar de esta sección, retornamos null
    if (!show('credit') && !show('status')) return null;

    return (
        <Row gutter={[16, 16]}>
            {/* Solo se muestra si 'credit' está en el array extraFilters */}
            {show('credit') && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <WalletOutlined className="mr-1" /> Balance
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            placeholder="Todos"
                            value={filterValues.isCredit === true ? "true" : filterValues.isCredit === false ? "false" : undefined}
                            onChange={(val) => filterActions.setIsCredit(val === "true" ? true : val === "false" ? false : null)}
                            style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                        >
                            <Select.Option value="true">Credit</Select.Option>
                            <Select.Option value="false">Debit</Select.Option>
                        </Select>
                    </div>
                </Col>
            )}

            {/* Solo se muestra si 'status' está en el array extraFilters */}
            {show('status') && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <FlagOutlined className="mr-1" /> Status
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            placeholder="Cualquiera"
                            value={filterValues.companyStatus || undefined}
                            onChange={(val) => filterActions.setCompanyStatus(val as ClientStatus)}
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
    );
};
// components/work-entries/header-actions/PropertyFilters.tsx
import { Row, Col, Select } from "antd";
import { WalletOutlined, FlagOutlined } from "@ant-design/icons";
import { ClientStatus } from "./types";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

interface Props {
    isCredit?: boolean | null;
    setIsCredit?: (val: boolean | null) => void;
    companyStatus?: ClientStatus | null;
    setCompanyStatus?: (val: ClientStatus | null) => void;
}

export const PropertyFilters = ({ isCredit, setIsCredit, companyStatus, setCompanyStatus }: Props) => {
    if (!setIsCredit && !setCompanyStatus) return null;

    return (
        <Row gutter={[16, 16]}>
            {setIsCredit && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <WalletOutlined className="mr-1" /> Balance
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            placeholder="Todos"
                            value={isCredit === true ? "true" : isCredit === false ? "false" : undefined}
                            onChange={(val) => setIsCredit(val === "true" ? true : val === "false" ? false : null)}
                            style={{ width: "100%", borderBottom: '1px solid #e5e7eb' }}
                        >
                            <Select.Option value="true">Credit</Select.Option>
                            <Select.Option value="false">Debit</Select.Option>
                        </Select>
                    </div>
                </Col>
            )}

            {setCompanyStatus && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <FlagOutlined className="mr-1" /> Status
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
    );
};
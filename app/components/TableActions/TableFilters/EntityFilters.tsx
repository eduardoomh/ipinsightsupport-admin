// components/work-entries/header-actions/EntityFilters.tsx
import { Row, Col, Select } from "antd";
import { BankOutlined, UserOutlined } from "@ant-design/icons";
import { Company, User } from "./types";

interface Props {
    enableCompanyFilter?: boolean;
    companyId?: string | null;
    setCompanyId?: (val: string | null) => void;
    companies: Company[];
    isLoadingCompanies: boolean;
    
    enableUserFilter?: boolean;
    userId?: string | null;
    setUserId?: (val: string | null) => void;
    users: User[];
    isLoadingUsers: boolean;
}

export const EntityFilters = ({
    enableCompanyFilter, companyId, setCompanyId, companies, isLoadingCompanies,
    enableUserFilter, userId, setUserId, users, isLoadingUsers
}: Props) => {
    if (!enableCompanyFilter && !enableUserFilter) return null;

    return (
        <Row gutter={[16, 16]}>
            {enableCompanyFilter && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <BankOutlined className="mr-1" /> Company
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            showSearch
                            placeholder="Select..."
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

            {enableUserFilter && (
                <Col span={24}>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            <UserOutlined className="mr-1" /> User
                        </label>
                        <Select
                            variant="borderless"
                            allowClear
                            showSearch
                            placeholder="Select..."
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
        </Row>
    );
};
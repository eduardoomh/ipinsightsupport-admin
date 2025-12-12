import { Button, Modal, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { HeaderActionsProps, Company, User, FilterTag } from "./types";
import { DateFilter } from "./DateFilter";
import { EntityFilters } from "./EntityFilters";
import { PropertyFilters } from "./PropertyFilters";
import { ActiveTagsBar } from "./ActiveTagsBar";

const { Text } = Typography;

interface Props extends HeaderActionsProps {
    isOpen: boolean;
    onClose: () => void;
    activeTags: FilterTag[];
    companies: Company[];
    isLoadingCompanies: boolean;
    users: User[];
    isLoadingUsers: boolean;
}

export const FilterModal = ({
    isOpen, onClose, handleApplyFilter, handleResetFilter, activeTags,
    companies, isLoadingCompanies, users, isLoadingUsers,
    ...filterProps
}: Props) => {

    return (
        <Modal
            title={<div className="flex items-center gap-2 text-lg"><FilterOutlined /> <span>Advanced filters</span></div>}
            open={isOpen}
            onCancel={onClose}
            onOk={() => { handleApplyFilter(); onClose(); }}
            okText={`Apply Filters ${activeTags.length > 0 ? `(${activeTags.length})` : ''}`}
            width={650}
            destroyOnClose
            styles={{ body: { paddingBottom: 0 } }}
            footer={
                <>
                    <Button
                        type="default"
                        onClick={onClose}
                    >
                       Cancel
                    </Button>
                    <Button
                        type="primary"
                        className="bg-primary"
                        onClick={() => { handleApplyFilter(); onClose(); }}
                    >
                        {`Apply Filters ${activeTags.length > 0 ? `(${activeTags.length})` : ''}`}
                    </Button>
                </>
            }
        >
            <Space direction="vertical" size="large" className="w-full py-4">

                <ActiveTagsBar tags={activeTags} onResetAll={handleResetFilter} variant="modal" />
                <DateFilter
                    selectedFilter={filterProps.selectedFilter}
                    setSelectedFilter={filterProps.setSelectedFilter}
                    dateRange={filterProps.dateRange}
                    setDateRange={filterProps.setDateRange}
                />

                {(filterProps.enableCompanyFilter || filterProps.enableUserFilter || filterProps.setIsCredit || filterProps.setCompanyStatus) && (
                    <div className="bg-white">
                        <Text strong className="block mb-3 text-gray-700 text-base">
                            <FilterOutlined className="mr-2 text-purple-500" /> Criteria
                        </Text>

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <EntityFilters
                                enableCompanyFilter={filterProps.enableCompanyFilter}
                                companyId={filterProps.companyId}
                                setCompanyId={filterProps.setCompanyId}
                                companies={companies}
                                isLoadingCompanies={isLoadingCompanies}
                                enableUserFilter={filterProps.enableUserFilter}
                                userId={filterProps.userId}
                                setUserId={filterProps.setUserId}
                                users={users}
                                isLoadingUsers={isLoadingUsers}
                            />

                            <PropertyFilters
                                isCredit={filterProps.isCredit}
                                setIsCredit={filterProps.setIsCredit}
                                companyStatus={filterProps.companyStatus}
                                setCompanyStatus={filterProps.setCompanyStatus}
                            />
                        </Space>
                    </div>
                )}
            </Space>
        </Modal>
    );
};
import { Button, Modal, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Company, User, FilterTag } from "./types";
import { DateFilter } from "./DateFilter";
import { EntityFilters } from "./EntityFilters";
import { PropertyFilters } from "./PropertyFilters";
import { ActiveTagsBar } from "./ActiveTagsBar";
import { OptionalFilter } from ".";
import { FilterActions, FilterValues } from "~/hooks/useFilters";

const { Text } = Typography;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    activeTags: FilterTag[];
    companies: Company[];
    isLoadingCompanies: boolean;
    users: User[];
    isLoadingUsers: boolean;
    filterValues: FilterValues;
    filterActions: FilterActions;
    extraFilters?: OptionalFilter[];
}

export const FilterModal = ({
    isOpen,
    onClose,
    activeTags,
    companies,
    isLoadingCompanies,
    users,
    isLoadingUsers,
    filterValues,
    filterActions,
    extraFilters = []
}: Props) => {

    // Helper para verificar visibilidad
    const show = (filter: OptionalFilter) => extraFilters.includes(filter);

    const onApply = () => {
        filterActions.handleApplyFilter();
        onClose();
    };

    // Determinamos si debemos mostrar la sección de "Criteria"
    const hasCriteria = extraFilters.length > 0;

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-lg">
                    <FilterOutlined /> <span>Advanced filters</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={650}
            destroyOnClose
            styles={{ body: { paddingBottom: 0 } }}
            footer={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        className="bg-primary"
                        onClick={onApply}
                    >
                        {`Apply Filters ${activeTags.length > 0 ? `(${activeTags.length})` : ''}`}
                    </Button>
                </Space>
            }
        >
            <Space direction="vertical" size="large" className="w-full py-4">

                <ActiveTagsBar
                    tags={activeTags}
                    onResetAll={filterActions.handleResetFilter}
                    variant="modal"
                />

                {/* La fecha siempre es visible según definimos */}
                <DateFilter
                    selectedFilter={filterValues.selectedFilter}
                    setSelectedFilter={filterActions.setSelectedFilter}
                    dateRange={filterValues.dateRange}
                    setDateRange={filterActions.setDateRange}
                />

                {hasCriteria && (
                    <div className="bg-white">
                        <Text strong className="block mb-3 text-gray-700 text-base">
                            <FilterOutlined className="mr-2 text-purple-500" /> Criteria
                        </Text>

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {/* Filtros de Entidades (Company / User) */}
                            {(show('company') || show('user')) && (
                                <EntityFilters
                                    extraFilters={extraFilters}
                                    filterValues={filterValues}
                                    filterActions={filterActions}
                                    companies={companies}
                                    isLoadingCompanies={isLoadingCompanies}
                                    users={users}
                                    isLoadingUsers={isLoadingUsers}
                                />
                            )}

                            {/* Filtros de Propiedades (Credit / Status) */}
                            {(show('credit') || show('status')) && (
                                <PropertyFilters
                                    extraFilters={extraFilters}
                                    filterValues={filterValues}
                                    filterActions={filterActions}
                                />
                            )}
                        </Space>
                    </div>
                )}
            </Space>
        </Modal>
    );
};
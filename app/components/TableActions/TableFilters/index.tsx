import { useState, useEffect, useMemo } from "react";
import { Button, Space, Typography } from "antd";
import { FilterOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useFetcher } from "@remix-run/react";
import DownloadButton from "../DownloadMenu";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

import { Company, User, FilterTag } from "./types";
import { ActiveTagsBar } from "./ActiveTagsBar";
import { FilterModal } from "./FilterModal";

const { Title } = Typography;

export type OptionalFilter = 'company' | 'user' | 'credit' | 'status';

interface HeaderActionsProps {
    title: string;
    path: string;
    fileName: string;
    createButton?: { label: string; path: string };
    filterValues: any;
    filterActions: any;
    extraFilters?: OptionalFilter[];
}

export default function HeaderActions({
    title, path, fileName, filterValues, filterActions, createButton,
    extraFilters = []
}: HeaderActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const show = (filter: OptionalFilter) => extraFilters.includes(filter);

    const companyFetcher = useFetcher<{ clients?: Company[]; items?: Company[] }>();
    const userFetcher = useFetcher<{ users?: User[]; items?: User[] }>();


    useEffect(() => {
        if (show('company') && companyFetcher.state === "idle" && !companyFetcher.data) {
            companyFetcher.load("/api/clients?fields=id,company&take=1000");
        }
    }, [extraFilters]);

    useEffect(() => {
        if (show('user') && userFetcher.state === "idle" && !userFetcher.data) {
            userFetcher.load("/api/users?take=1000&fields=id,name");
        }
    }, [extraFilters]);

    const companies = companyFetcher.data?.clients || companyFetcher.data?.items || [];
    const users = userFetcher.data?.users || userFetcher.data?.items || [];

    const activeTags = useMemo<FilterTag[]>(() => {
        const tags: FilterTag[] = [];

        if (filterValues.selectedFilter === "recent") {
            tags.push({ key: 'recent', label: 'Most recent', color: 'blue', onRemove: () => filterActions.setSelectedFilter(null) });
        } else if (filterValues.selectedFilter === "date" && filterValues.dateRange) {
            tags.push({
                key: 'date',
                label: `${filterValues.dateRange[0].format("DD MMM")} - ${filterValues.dateRange[1].format("DD MMM")}`,
                color: 'blue',
                onRemove: () => { filterActions.setDateRange(null); filterActions.setSelectedFilter(null); }
            });
        }

        if (show('company') && filterValues.companyId) {
            const name = companies.find(c => c.id === filterValues.companyId)?.company || 'Compañía';
            tags.push({ key: 'company', label: name, color: 'purple', onRemove: () => filterActions.setCompanyId(null) });
        }

        if (show('user') && filterValues.userId) {
            const name = users.find(u => u.id === filterValues.userId)?.name || 'Usuario';
            tags.push({ key: 'user', label: name, color: 'volcano', onRemove: () => filterActions.setUserId(null) });
        }

        if (show('credit') && filterValues.isCredit !== null) {
            tags.push({
                key: 'credit',
                label: filterValues.isCredit ? 'Crédito' : 'Débito',
                color: 'cyan',
                onRemove: () => filterActions.setIsCredit(null)
            });
        }

        if (show('status') && filterValues.companyStatus) {
            tags.push({
                key: 'status',
                label: getClientStatusLabel(filterValues.companyStatus),
                color: 'gold',
                onRemove: () => filterActions.setCompanyStatus(null)
            });
        }
        return tags;
    }, [filterValues, extraFilters, companies, users]);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <Title level={3} style={{ margin: 0 }}>{title}</Title>

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
                        selectedFilter={filterValues.selectedFilter}
                        isCredit={show('credit') ? filterValues.isCredit : null}
                        companyStatus={show('status') ? filterValues.companyStatus : null}
                        clientId={show('company') ? filterValues.companyId : null}
                        userId={show('user') ? filterValues.userId : null}
                        dateRange={filterValues.dateRange ? [filterValues.dateRange[0].toDate(), filterValues.dateRange[1].toDate()] : null}
                    />

                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setIsModalOpen(true)}
                        className={activeTags.length > 0 ? "border-blue-500 text-blue-600 font-medium" : ""}
                    >
                        Filters
                        {activeTags.length > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {activeTags.length}
                            </span>
                        )}
                    </Button>

                    {activeTags.length > 0 && (
                        <Button type="text" danger icon={<CloseCircleOutlined />} onClick={filterActions.handleResetFilter}>
                            Clean
                        </Button>
                    )}
                </Space>
            </div>

            <ActiveTagsBar tags={activeTags} variant="header" />
            
            <FilterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeTags={activeTags}
                companies={companies}
                isLoadingCompanies={companyFetcher.state === "loading"}
                users={users}
                isLoadingUsers={userFetcher.state === "loading"}
                filterValues={filterValues}
                filterActions={filterActions}
                extraFilters={extraFilters}
            />
        </div>
    );
}
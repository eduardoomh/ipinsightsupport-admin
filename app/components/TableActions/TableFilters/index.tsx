import { useState, useEffect, useMemo } from "react";
import { Button, Space, Typography } from "antd";
import { FilterOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useFetcher } from "@remix-run/react";
import DownloadButton from "../DownloadMenu";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

import { HeaderActionsProps, Company, User, FilterTag } from "./types";
import { ActiveTagsBar } from "./ActiveTagsBar";
import { FilterModal } from "./FilterModal";

const { Title } = Typography;

export default function HeaderActions(props: HeaderActionsProps) {
    const {
        title, path, fileName, selectedFilter, dateRange, companyId, userId, isCredit, companyStatus,
        createButton, enableCompanyFilter, enableUserFilter, setSelectedFilter, setDateRange, 
        setCompanyId, setUserId, setIsCredit, setCompanyStatus, handleResetFilter
    } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const companies = companyFetcher.data?.clients || companyFetcher.data?.items || [];
    const users = userFetcher.data?.users || userFetcher.data?.items || [];

    const activeTags = useMemo<FilterTag[]>(() => {
        const tags: FilterTag[] = [];

        if (selectedFilter === "recent") {
            tags.push({ key: 'recent', label: 'Most recent', color: 'blue', onRemove: () => setSelectedFilter(null) });
        } else if (selectedFilter === "date" && dateRange) {
            tags.push({ 
                key: 'date', 
                label: `${dateRange[0].format("DD MMM")} - ${dateRange[1].format("DD MMM")}`, 
                color: 'blue', 
                onRemove: () => { setDateRange(null); setSelectedFilter(null); } 
            });
        }

        if (companyId) {
            const name = companies.find(c => c.id === companyId)?.company || 'Compañía';
            tags.push({ key: 'company', label: name, color: 'purple', onRemove: () => setCompanyId?.(null) });
        }

        if (userId) {
            const name = users.find(u => u.id === userId)?.name || 'Usuario';
            tags.push({ key: 'user', label: name, color: 'volcano', onRemove: () => setUserId?.(null) });
        }

        if (isCredit !== undefined && isCredit !== null) {
            tags.push({ 
                key: 'credit', 
                label: isCredit ? 'Crédito' : 'Débito', 
                color: 'cyan', 
                onRemove: () => setIsCredit?.(null) 
            });
        }

        if (companyStatus) {
            tags.push({ 
                key: 'status', 
                label: getClientStatusLabel(companyStatus), 
                color: 'gold', 
                onRemove: () => setCompanyStatus?.(null) 
            });
        }
        return tags;
    }, [selectedFilter, dateRange, companyId, userId, isCredit, companyStatus, companies, users]);

    const activeCount = activeTags.length;

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
                        selectedFilter={selectedFilter}
                        isCredit={isCredit}
                        companyStatus={companyStatus}
                        clientId={companyId}
                        userId={userId}
                        dateRange={dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : null}
                    />
                    
                    <Button 
                        icon={<FilterOutlined />} 
                        onClick={() => setIsModalOpen(true)}
                        type={"default"}
                        className={activeCount > 0 ? "border-blue-500 text-blue-600 font-medium" : ""}
                    >
                        Filters 
                        {activeCount > 0 && (
                            <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {activeCount}
                            </span>
                        )}
                    </Button>

                    {activeCount > 0 && (
                         <Button type="text" danger icon={<CloseCircleOutlined />} onClick={handleResetFilter}>
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
                {...props}
            />
        </div>
    );
}
import { Dayjs } from "dayjs";

export enum ClientStatus {
    ADHOC = "ADHOC",
    IN_PROGRESS = "IN_PROGRESS",
    ARCHIVE = "ARCHIVE",
    WAITING_ON_AM = "WAITING_ON_AM",
    WAITING_ON_CLIENT = "WAITING_ON_CLIENT",
    TRANSFER = "TRANSFER",
}

export interface Company {
    id: string;
    company: string;
}

export interface User {
    id: string;
    name: string;
}

export interface HeaderActionsProps {
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

export interface FilterTag {
    key: string;
    label: string;
    color: string;
    onRemove: () => void;
}
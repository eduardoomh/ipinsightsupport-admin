export interface ReportI {
    workEntries: ReportWorkEntry[];
}

export interface ReportCompanyI {
    workEntries: ReportCompanyWorkEntry[];
}

export interface ReportWorkEntry {
    id: string;
    billed_on: string; // ISO date string
    hours_billed: number;
    hours_spent: number;
    hourly_rate: number;
    summary: string;
    rate_type: "engineering" | "architecture" | "senior_architecture";
    client: {
        id: string;
        company: string;
    };
    total_price: number;
}

export interface ReportCompanyWorkEntry {
    id: string;
    billed_on: string;
    hours_billed: number;
    hours_spent: number;
    hourly_rate: number;
    summary: string;
    rate_type: "engineering" | "architecture" | "senior_architecture";
    client: {
        id: string;
        company: string;
    };
    total_price: number;
}


export interface ReportUserDetail {
    workEntries: ReportWorkEntry[];
    managedClients: {
        id: string;
        company: string;
    }[];
}

export interface PDFUserMetadataI {
    user: string;
    startDate: string;
    endDate: string;
}


export interface PDFCompanyrMetadataI {
    company: string;
    startDate: string;
    endDate: string;
}
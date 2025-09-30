export interface ReportI {

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
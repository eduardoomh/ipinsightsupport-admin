
export interface CompanyReportI{
    id: string;
    company: string;
    total_hours_billed: number;
    total_hours_spent: number;
    total_price: number;
    rate_types: string[];
  };
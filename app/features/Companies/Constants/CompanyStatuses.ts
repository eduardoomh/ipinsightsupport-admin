
export const COMPANY_STATUSES = [
    "ADHOC",
    "IN_PROGRESS",
    "ARCHIVE",
    "WAITING_ON_AM",
    "WAITING_ON_CLIENT",
    "TRANSFER",
    "ALL"
] as const;

export type CompanyStatus = typeof COMPANY_STATUSES[number];
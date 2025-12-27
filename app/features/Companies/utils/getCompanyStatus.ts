
import { CompanyStatus } from "~/features/Companies/Constants/CompanyStatuses";

export const getCompanyStatus = (status: CompanyStatus): string => {
    switch (status) {
        case "ADHOC":
            return "Adhoc";
        case "IN_PROGRESS":
            return "In Progress";
        case "ARCHIVE":
            return "Archive";
        case "WAITING_ON_AM":
            return "Waiting on AM";
        case "WAITING_ON_CLIENT":
            return "Waiting on Client";
        case "TRANSFER":
            return "Transfer";
        case "ALL":
            return "Show all";
        default:
            return status;
    }
};
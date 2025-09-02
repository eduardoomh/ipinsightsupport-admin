
export const CLIENT_STATUSES = [
    "ADHOC",
    "IN_PROGRESS",
    "ARCHIVE",
    "WAITING_ON_AM",
    "WAITING_ON_CLIENT",
    "TRANSFER",
    "ALL"
] as const;

export type ClientStatus = typeof CLIENT_STATUSES[number];

export const getClientStatusLabel = (status: ClientStatus): string => {
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
            return status; // fallback
    }
};
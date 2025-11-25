
export enum SearchType {
    User = "user",
    Contact = "contact",
    Client = "client",
    WorkEntry = "workEntry",
    Retainer = "retainer"
}

export interface SearchResult {
    id: string;
    type: SearchType;
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    timezone?: string;
    remainingFunds?: number;
    currentStatus?: string;
    clientId?: string;
    userId?: string;
}

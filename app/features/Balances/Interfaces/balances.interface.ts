
export interface BalanceI {
    id: string;
    amount: number;
    date_activated: string;
    note?: string;
    is_credit: boolean;
    client: {
        id: string;
        company: string;
    };
    created_by: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface BalanceType {
    id: string;
    amount: number;
    date_activated: string;
    note?: string;
    is_credit: boolean;
    client: {
        id: string;
        company: string;
    };
    created_by: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}
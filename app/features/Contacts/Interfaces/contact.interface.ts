import { ClientI } from "~/features/Companies/Interfaces/clients.interface";

export interface ContactI {
    id: string;
    name: string;
    email: string;
    phone: string;
    client_id: string | null;
    client: ClientI;
    has_password?: boolean;
    createdAt: string;
    updatedAt: string;
}
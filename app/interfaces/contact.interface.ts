import { ClientI } from "./clients.interface";

export interface ContactI {
    id: string;
    name: string;
    email: string;
    phone: string;
    client_id: string | null;
    client: ClientI;
    createdAt: string;
    updatedAt: string;
}
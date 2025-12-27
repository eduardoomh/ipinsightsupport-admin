import { ClientI } from "~/features/Companies/Interfaces/clients.interface";
import { UsersI } from "~/features/Users/Interfaces/users.interface";

export interface TeamMembersI {
    id: string;
    role: 'on_team' | 'technical_lead';
    rate_type: 'engineering' | 'architecture' | 'senior_architecture';
    user_id: string;
    user: UsersI
    client_id: string;
    client: ClientI;
    createdAt: string;
}
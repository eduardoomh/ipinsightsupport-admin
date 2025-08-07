import { ClientI } from "./clients.interface";
import { UsersI } from "./users.interface";

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
import { ClientStatusHistoryI } from "./clientStatusHistory";
import { ContactI } from "./contact.interface";
import { RatesI } from "./rates.interface";
import { TeamMembersI } from "./teamMembers.interface";
import { UsersI } from "./users.interface";

export interface ClientI {
    id: string;
    company: string;
    timezone: string;
    account_manager: UsersI;
    contacts: ContactI[];
    team_members: TeamMembersI[];
    remainingFunds: any;
    most_recent_work_entry: null | string;
    most_recent_retainer_activated: null | string;
    estimated_engineering_hours?: number;
    estimated_architecture_hours?: number;
    estimated_senior_architecture_hours?: number;
    rates: RatesI;
    currentStatus: string;
    billing_type: string;
    lastNote?: ClientStatusHistoryI;
    createdAt: string;
    updatedAt: string;
}
import { ClientStatusHistoryI } from "~/interfaces/clientStatusHistory";
import { ContactI } from "~/interfaces/contact.interface";
import { RatesI } from "~/interfaces/rates.interface";
import { TeamMembersI } from "~/interfaces/teamMembers.interface";
import { UsersI } from "~/interfaces/users.interface";

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
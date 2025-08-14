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
    rates: RatesI;
    createdAt: string;
    updatedAt: string;
}
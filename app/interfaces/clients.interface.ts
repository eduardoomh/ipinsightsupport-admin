import { ContactI } from "./contact.interface";
import { TeamMembersI } from "./teamMembers.interface";

export interface ClientI {
    id: string;
    company: string;
    timezone: string;
    contacts: ContactI[];
    team_members: TeamMembersI[];
    most_recent_work_entry: null | string;
    most_recent_retainer_activated: null | string;
    createdAt: string;
    updatedAt: string;
}
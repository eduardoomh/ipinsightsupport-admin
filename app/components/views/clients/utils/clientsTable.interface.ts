import { ClientI } from "~/interfaces/clients.interface";

export interface DataType {
    id: string;
    company: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminDataType {
  id: string;
  company: string;
  team_members: ClientI["team_members"];
  most_recent_work_entry: string;
  most_recent_retainer_activated: string;
}
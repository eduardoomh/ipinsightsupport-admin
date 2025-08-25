import { ClientI } from "~/interfaces/clients.interface";
import { UsersI } from "~/interfaces/users.interface";
import { ClientStatus } from '../../../../utils/general/getClientStatusLabel';

export interface DataType {
    id: string;
    company: string;
    createdAt: string;
    updatedAt: string;
}

interface EstimatedHours {
  estimated_engineering_hours: string | number;
  estimated_architecture_hours: string | number;
  estimated_senior_architecture_hours: string | number;
}

export interface AdminDataType {
  id: string;
  company: string;
  team_members: ClientI["team_members"];
  estimated_hours: EstimatedHours;
  most_recent_work_entry: string;
  most_recent_retainer_activated: string;

}

export interface UserDataType {
  id: string;
  company: string;
  team_members: ClientI["team_members"];
  estimated_hours: {
    user_estimated_hours: any;
    user_rate_type: any;
  };
  account_manager: UsersI;
  timezone: string;
  currentStatus: ClientStatus;
  most_recent_work_entry: string;

}
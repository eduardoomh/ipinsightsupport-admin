import { ClientStatus } from "~/utils/general/getClientStatusLabel";

export interface ClientStatusHistoryI {
  id: string;
  status?: ClientStatus;
  note: string;
  title?: string;
  changedAt: string;
  changedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

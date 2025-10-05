export interface LogI {
    id: string;
    source: string;
    level: "INFO" | "WARNING" | "ERROR";
    message: string;
    details?: any;
    createdAt: string;
  }
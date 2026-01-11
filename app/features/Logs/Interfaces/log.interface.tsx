export type LogLevel = "INFO" | "WARNING" | "ERROR";
export interface LogI {
    id: string;
    source: string;
    level: LogLevel;
    message: string;
    details?: any;
    createdAt: string;
  }

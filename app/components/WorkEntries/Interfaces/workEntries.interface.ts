type RateType = 'engineering' | 'architecture' | 'senior_architecture'

export interface WorkEntry {
    id: string;
    billed_on: string;
    hours_billed: number;
    hours_spent: number;
    hourly_rate: number;
    summary: string;
    rate_type: RateType,
    client: any;
    user: any;
    created_at: string;
}

export interface DataType {
  id: string;
  billed_on: string;
  client: {
    id: string;
    company: string;
  };
  user: {
    id: string;
    name: string;
  }
  hours_billed: number;
  hours_spent: number;
  summary: string;
  hourly_rate: number;
  billing_type: string;
  created_at: string;
}
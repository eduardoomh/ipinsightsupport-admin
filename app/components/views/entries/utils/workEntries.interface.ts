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
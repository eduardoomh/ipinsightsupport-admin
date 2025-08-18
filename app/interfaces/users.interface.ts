
export interface UsersI {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_admin: boolean,
    is_active: boolean,
    is_account_manager: boolean,
    type: 'engineering' | 'archtecture' | 'senior_architecture',
    avatar: string,
    last_login: null,
    createdAt: string;
    updatedAt: string;
}

export type UserI = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "CLIENT"; // o lo que definas
  company_id?: string;
};

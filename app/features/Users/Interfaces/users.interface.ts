
export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    CLIENT = "CLIENT"
}
export enum UserExpertise {
    ENGINEERING = "engineering",
    ARCHITECTURE = "archtecture",
    SENIOR_ARCHITECTURE = "senior_architecture"
}
export interface UsersI {
    id: string;
    name: string;
    email: string;
    phone: string;
    is_admin: boolean,
    is_active: boolean,
    is_account_manager: boolean,
    type: UserExpertise,
    avatar: string,
    last_login: null,
    has_password?: boolean,
    createdAt: string;
    updatedAt: string;
}

export type UserI = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: string;
};

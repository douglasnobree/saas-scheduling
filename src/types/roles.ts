export enum UserRole {
  ADMIN = "admin",
  BUSINESS_ADMIN = "business_admin",
  USER = "user",
}

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  full_name?: string;
  avatar_url?: string;
}

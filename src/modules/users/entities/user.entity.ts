export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole | string;
  is_verified: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}


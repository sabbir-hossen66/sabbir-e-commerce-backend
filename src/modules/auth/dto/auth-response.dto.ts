import { UserRole } from '@modules/users/entities/user.entity';

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: PublicUser;
}
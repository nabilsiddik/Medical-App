export enum UserRole {
  ADMIN = "ADMIN",
  PATIENT = "PATIENT",
  SUPER_ADMIN = "SUPER_ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  OTHERS = "OTHER",
}

export interface IUserInfo {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profilePhoto?: string | null;
  phoneNumber?: string | null;
  isEmailVerified?: boolean;
  status?: UserStatus;
  gender?: Gender | string | null;
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  profilePhoto?: string | null;
  address?: string | null;
  gender?: Gender | string | null;
  role: UserRole;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: UserStatus;

  isDeleted: boolean;
  lastLoginAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IPaginatedResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IMeta;
  data: T[];
}

export interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
}

export interface IUserStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    deletedUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
  };
  roles: {
    admin: number;
    patient: number;
  };
  monthlyTrends: {
    month: string;
    users: number;
    active: number;
  }[];
}

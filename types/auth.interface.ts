import { UserRole } from "./user.interface";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHERS";
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
  type: "EMAIL_VERIFICATION" | "FORGOT_PASSWORD";
}

export interface IResendOtpPayload {
  email: string;
  type: "EMAIL_VERIFICATION" | "FORGOT_PASSWORD";
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  resetToken: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IAuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profilePhoto?: string | null;
  isEmailVerified?: boolean;
}

export interface ILoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: IAuthUser;
}

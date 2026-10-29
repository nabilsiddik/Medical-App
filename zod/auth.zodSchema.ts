import { z } from "zod";

export const UserRoleEnum = z.enum(["ADMIN", "PATIENT", "SUPER_ADMIN", "USER"]);
export const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED", "DELETED"]);
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "OTHERS"]);

// Login schema
export const loginValidationZodSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

// User registration schema (Patient Signup)
export const registerUserZodSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name must be under 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .optional()
      .or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "OTHERS"], {
      message: "Please select your gender",
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Verify OTP schema
export const verifyOtpZodSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  type: z.enum(["EMAIL_VERIFICATION", "FORGOT_PASSWORD"]).default("EMAIL_VERIFICATION"),
});

// Forgot Password schema
export const forgotPasswordZodSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Reset Password schema
export const resetPasswordZodSchema = z
  .object({
    resetToken: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Change Password schema
export const changePasswordZodSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Update Profile schema
export const updateUserProfileZodSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters").optional(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gender: GenderEnum.optional().nullable(),
});

// Update User Status schema (Admin)
export const updateUserStatusZodSchema = z.object({
  status: UserStatusEnum,
});

// Update User Role schema (Admin)
export const updateUserRoleZodSchema = z.object({
  role: UserRoleEnum,
});

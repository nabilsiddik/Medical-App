"use server";

import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie, deleteCookie } from "./tokenHandler";
import { serverFetch } from "@/lib/serverFetch";
import { zodValidator } from "@/lib/zodValidator";
import {
  loginValidationZodSchema,
  registerUserZodSchema,
  verifyOtpZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
} from "@/zod/auth.zodSchema";
import { UserRole } from "@/types/user.interface";
import { getDefaultDashboardRoute, isValidRedirectForRole } from "@/lib/authUtils";
import {
  IForgotPasswordPayload,
  ILoginPayload,
  IResendOtpPayload,
  IResetPasswordPayload,
  IVerifyOtpPayload,
} from "@/types/auth.interface";

// 1. User Login
export const loginUser = async (
  _currentState?: any,
  formData?: any
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || null;
    const payload: ILoginPayload = {
      email: (formData.get("email") as string)?.trim(),
      password: formData.get("password") as string,
    };

    // Validate with Zod
    const validation = zodValidator(payload, loginValidationZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      const msg = result.message || "Invalid email or password";
      return {
        success: false,
        message: msg,
      };
    }

    const data = result.data;
    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication token missing from response.",
      };
    }

    // Set cookies in Next.js
    await setCookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    if (refreshToken) {
      await setCookie("refreshToken", refreshToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    // Decode token for role routing
    let userRole: UserRole = UserRole.PATIENT;
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload;
      if (decoded?.role) {
        userRole = decoded.role as UserRole;
      }
    } catch {
      // fallback
    }

    if (redirectTo) {
      const redirectPath = redirectTo.toString();
      const safeRedirect = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
      if (isValidRedirectForRole(redirectPath, userRole)) {
        redirect(safeRedirect);
      } else {
        redirect(getDefaultDashboardRoute(userRole));
      }
    } else {
      redirect(getDefaultDashboardRoute(userRole));
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    return {
      success: false,
      message: err?.message || "Login failed. Please check your credentials.",
    };
  }
};

// 2. User Registration (Patient Signup with Automatic Login & Role Assignment)
export const registerUser = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const rawPayload = {
      fullName: (formData.get("fullName") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      phoneNumber: (formData.get("phoneNumber") as string)?.trim() || undefined,
      gender: (formData.get("gender") as any) || "MALE",
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = zodValidator(rawPayload, registerUserZodSchema);
    if (!validation.success) {
      return validation;
    }

    const validatedData = validation.data as any;
    const { confirmPassword, ...registerData } = validatedData;

    const res = await serverFetch.post("/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed. Please try again.",
      };
    }

    const data = result.data;
    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;

    if (accessToken) {
      await setCookie("accessToken", accessToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    if (refreshToken) {
      await setCookie("refreshToken", refreshToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    return {
      success: true,
      autoLoggedIn: true,
      message: result.message || "Account created successfully! Welcome to CarePractice.",
      user: data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Registration failed. Please try again.",
    };
  }
};

// 3. Verify OTP (Logs user in upon email verification)
export const verifyOtp = async (payload: IVerifyOtpPayload): Promise<any> => {
  try {
    const validation = zodValidator(payload, verifyOtpZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.post("/auth/verify-email", {
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "OTP verification failed.",
      };
    }

    // When verifying email, backend returns login tokens
    if (result.data?.accessToken) {
      await setCookie("accessToken", result.data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    if (result.data?.refreshToken) {
      await setCookie("refreshToken", result.data.refreshToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "OTP verified successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "An unexpected error occurred during OTP verification.",
    };
  }
};

// 4. Resend OTP
export const resendOtp = async (payload: IResendOtpPayload): Promise<any> => {
  try {
    const res = await serverFetch.post("/auth/resend-otp", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to resend OTP.",
      };
    }

    return {
      success: true,
      message: result.message || "OTP resent successfully. Please check your inbox.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to resend OTP.",
    };
  }
};

// 5. Forgot Password
export const forgotPassword = async (payload: IForgotPasswordPayload): Promise<any> => {
  try {
    const validation = zodValidator(payload, forgotPasswordZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.post("/auth/forgot-password", {
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to process forgot password request.",
      };
    }

    return {
      success: true,
      message: result.message || "Password reset OTP sent to your email.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to process forgot password request.",
    };
  }
};

// 6. Reset Password
export const resetPassword = async (payload: IResetPasswordPayload): Promise<any> => {
  try {
    const validation = zodValidator(payload, resetPasswordZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.post("/auth/reset-password", {
      body: JSON.stringify({
        resetToken: payload.resetToken,
        newPassword: payload.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to reset password.",
      };
    }

    return {
      success: true,
      message: result.message || "Password reset successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to reset password.",
    };
  }
};

// 7. Change Password
export const changePassword = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const rawPayload = {
      oldPassword: formData.get("oldPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = zodValidator(rawPayload, changePasswordZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.patch("/auth/change-password", {
      body: JSON.stringify({
        oldPassword: rawPayload.oldPassword,
        newPassword: rawPayload.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to change password.",
      };
    }

    return {
      success: true,
      message: result.message || "Password changed successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to change password.",
    };
  }
};

// 8. User Logout
export const logoutUser = async (): Promise<any> => {
  try {
    await serverFetch.post("/auth/logout");
  } catch {
    // Continue clearing cookies regardless
  } finally {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
  }
  return { success: true, message: "Logged out successfully" };
};

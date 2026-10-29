"use server";

import { serverFetch } from "@/lib/serverFetch";
import { IUser, IUserStats, IMeta, UserRole, UserStatus } from "@/types/user.interface";
import { deleteCookie } from "../auth/tokenHandler";
import { zodValidator } from "@/lib/zodValidator";
import { updateUserProfileZodSchema } from "@/zod/auth.zodSchema";

// 1. Get logged in user profile
export const getLoggedInUser = async (): Promise<IUser | null> => {
  try {
    const res = await serverFetch.get("/user/profile");
    if (!res.ok) return null;
    const result = await res.json();
    return result?.data || null;
  } catch (error) {
    return null;
  }
};

// Alias for getLoggedInUser
export const getMyProfile = getLoggedInUser;

// 2. Update own profile
export const updateUserProfile = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const rawPayload = {
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") ? (formData.get("phoneNumber") as string) : undefined,
      address: formData.get("address") ? (formData.get("address") as string) : undefined,
      gender: formData.get("gender") ? (formData.get("gender") as any) : undefined,
    };

    const validation = zodValidator(rawPayload, updateUserProfileZodSchema);
    if (!validation.success) {
      return validation;
    }

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(validation.data));

    const file = formData.get("profilePhoto") as File;
    if (file && file.size > 0) {
      newFormData.append("file", file);
    }

    const res = await serverFetch.patch("/user/profile", {
      body: newFormData,
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update profile.",
    };
  }
};

// 3. Delete own account
export const deleteMyAccount = async (): Promise<any> => {
  try {
    const res = await serverFetch.delete("/user/profile");
    const result = await res.json();
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete account.",
    };
  }
};

// 4. Get all users (Admin / Super Admin)
export const getAllUsers = async (queryString: string = ""): Promise<{
  data: IUser[];
  meta: IMeta;
  success: boolean;
  message?: string;
}> => {
  try {
    const query = queryString ? `?${queryString}` : "";
    const res = await serverFetch.get(`/user${query}`);
    const result = await res.json();

    return {
      success: result.success,
      data: result?.data || [],
      meta: result?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
      message: result?.message,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
      message: error?.message || "Failed to retrieve users.",
    };
  }
};

// 5. Get user by ID (Admin / Super Admin)
export const getUserById = async (id: string): Promise<any> => {
  try {
    const res = await serverFetch.get(`/user/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to retrieve user.",
    };
  }
};

// 6. Update user status by Admin
export const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<any> => {
  try {
    const res = await serverFetch.patch(`/user/update-status/${userId}`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user status.",
    };
  }
};

// 7. Update user role by Super Admin
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<any> => {
  try {
    const res = await serverFetch.patch(`/user/update-role/${userId}`, {
      body: JSON.stringify({ role }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user role.",
    };
  }
};

// 8. Soft delete user by Admin
export const softDeleteUser = async (userId: string): Promise<any> => {
  try {
    const res = await serverFetch.patch(`/user/soft-delete/${userId}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete user.",
    };
  }
};

// 9. Get User Statistics for Dashboards
export const getUserStats = async (): Promise<{
  success: boolean;
  data: IUserStats | null;
  message?: string;
}> => {
  try {
    const res = await serverFetch.get("/user/stats");
    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to fetch stats",
      };
    }
    const result = await res.json();
    return {
      success: result.success,
      data: result.data || null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message || "Failed to fetch user statistics.",
    };
  }
};

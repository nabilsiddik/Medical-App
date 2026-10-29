import { z } from "zod";
import { GenderEnum, UserRoleEnum, UserStatusEnum } from "./auth.zodSchema";

export const userFilterZodSchema = z.object({
  searchTerm: z.string().optional(),
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
  gender: GenderEnum.optional(),
  isEmailVerified: z.enum(["true", "false"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

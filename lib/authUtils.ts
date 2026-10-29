import { UserRole } from "@/types/user.interface";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = [
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

export const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
];

export const adminProtectedRoutes: RouteConfig = {
  exact: ["/admin"],
  patterns: [/^\/admin\/?/],
};

export const userProtectedRoutes: RouteConfig = {
  exact: ["/user"],
  patterns: [/^\/user\/?/],
};

// Check if route is an auth route
export const isAuthRoute = (pathName: string) => {
  return authRoutes.some((route: string) => pathName === route || pathName.startsWith(`${route}/`));
};

// Check if route matches config
export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

// Get the route owner / requirement
export const getRouteOwner = (
  pathname: string
): "ADMIN" | "USER" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }
  return null;
};

// Check if role is staff/doctor
export const isStaffOrAdmin = (role?: UserRole | string | null): boolean => {
  if (!role) return false;
  return (
    role === UserRole.ADMIN ||
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.DOCTOR ||
    role === UserRole.RECEPTIONIST ||
    role === "ADMIN" ||
    role === "SUPER_ADMIN" ||
    role === "DOCTOR" ||
    role === "RECEPTIONIST"
  );
};

// Get default dashboard route based on user role
export const getDefaultDashboardRoute = (role?: UserRole | string | null): string => {
  if (isStaffOrAdmin(role)) {
    return "/admin/dashboard";
  }
  if (role === UserRole.USER || role === UserRole.PATIENT || role === "USER" || role === "PATIENT") {
    return "/user/dashboard";
  }
  return "/";
};

// Check if redirect path is valid for role
export const isValidRedirectForRole = (
  redirectPath: string,
  role?: UserRole | string | null
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null) {
    return true;
  }

  if (routeOwner === "ADMIN") {
    return isStaffOrAdmin(role);
  }

  if (routeOwner === "USER") {
    return isStaffOrAdmin(role) || role === UserRole.USER || role === UserRole.PATIENT;
  }

  return true;
};

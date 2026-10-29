import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "./types/user.interface";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isStaffOrAdmin,
} from "./lib/authUtils";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload;
      if (decoded && decoded.role) {
        userRole = decoded.role as UserRole;
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Redirect base dashboard routes to overview
  if (pathname === "/admin/dashboard" || pathname === "/admin") {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/user/dashboard" || pathname === "/user") {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check if it is an auth route (/login, /signup, /verify-otp, /forgot-password, /reset-password)
  const isAuth = isAuthRoute(pathname);

  // If already logged in and visiting an auth route, redirect to default dashboard
  if (accessToken && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  const routeOwner = getRouteOwner(pathname);

  // If route is public
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // If unauthenticated user tries to access protected route
  if (!accessToken && (routeOwner === "ADMIN" || routeOwner === "USER")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection: non-staff trying to access staff/admin dashboard
  if (routeOwner === "ADMIN") {
    if (!isStaffOrAdmin(userRole)) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url)
      );
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};

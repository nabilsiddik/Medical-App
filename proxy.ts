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
  let isTokenValid = false;

  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const currentTime = Math.floor(Date.now() / 1000);
      // Ensure token has role and has not expired
      if (decoded && decoded.role && (!decoded.exp || decoded.exp > currentTime)) {
        userRole = decoded.role as UserRole;
        isTokenValid = true;
      }
    } catch {
      isTokenValid = false;
      userRole = null;
    }
  }

  // Check if it is an auth route (/login, /signup, /verify-otp, /forgot-password, /reset-password)
  const isAuth = isAuthRoute(pathname);
  const isUnauthorizedRedirect =
    request.nextUrl.searchParams.has("unauthorized") ||
    request.nextUrl.searchParams.has("redirect");

  // If visiting an auth route with an unauthorized/redirect flag, or if the token is invalid:
  // Purge the stale cookies and allow the login page to render cleanly without redirect loops
  if (isAuth && (isUnauthorizedRedirect || !isTokenValid)) {
    const response = NextResponse.next();
    if (accessToken) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
    return response;
  }

  // If already logged in with a VALID non-expired token and visiting an auth route (not an unauthorized fallback), redirect to default dashboard
  if (isTokenValid && isAuth && !isUnauthorizedRedirect) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  // Redirect base dashboard routes to overview
  if (pathname === "/admin/dashboard" || pathname === "/admin") {
    if (!isTokenValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (accessToken) {
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
      }
      return res;
    }
  }

  if (pathname === "/user/dashboard" || pathname === "/user") {
    if (!isTokenValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (accessToken) {
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
      }
      return res;
    }
  }

  const routeOwner = getRouteOwner(pathname);

  // If route is public
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // If unauthenticated or token is expired when trying to access protected route
  if (!isTokenValid && (routeOwner === "ADMIN" || routeOwner === "USER")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    if (accessToken) {
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
    }
    return res;
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

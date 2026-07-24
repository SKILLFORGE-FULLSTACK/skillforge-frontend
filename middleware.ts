import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/", "/verify", "/u", "/auth/callback", "/privacy", "/terms"];
const RECRUITER_ROUTES = ["/recruiter"];
const DEVELOPER_ROUTES = [
  "/dashboard",
  "/interviews",
  "/certifications",
  "/progress",
  "/community",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("skillforge_token")?.value;

  // Routes publiques — toujours accessibles
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute) return NextResponse.next();

  // Pas connecté → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};

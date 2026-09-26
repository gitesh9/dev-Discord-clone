import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default function middleware(req: any, evt: any) {
	const pathname = req.nextUrl?.pathname || "";

	// 1. Bypass Clerk middleware entirely for internal assets, proxies, and static resources
	if (
		pathname.startsWith("/api/auth") ||
		pathname.startsWith("/api/clerk-proxy") ||
		pathname.startsWith("/api/__clerk") ||
		pathname.startsWith("/__clerk") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon.ico")
	) {
		return NextResponse.next();
	}

	// 2. Allow guest / demo authenticated users to access all application routes
	// without Clerk intercepting and forcing a redirect
	const demoUserId = req.cookies?.get("demo_user_id")?.value;
	if (demoUserId) {
		return NextResponse.next();
	}

	// 3. If Clerk publishable key is not set, allow Next.js routing
	if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
		return NextResponse.next();
	}

	// 4. Clerk auth middleware with explicitly defined public routes
	return authMiddleware({
		publicRoutes: [
			"/",
			"/sign-in(.*)",
			"/sign-up(.*)",
			"/invite(.*)",
			"/setup(.*)",
			"/api/auth(.*)",
			"/api/uploadthing(.*)",
			"/api/clerk-proxy(.*)",
			"/api/__clerk(.*)",
			"/__clerk(.*)",
			"/servers(.*)",
			"/api(.*)",
		],
		ignoredRoutes: [
			"/api/clerk-proxy(.*)",
			"/api/__clerk(.*)",
			"/__clerk(.*)",
			"/_next(.*)",
			"/favicon.ico",
		],
	})(req, evt);
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

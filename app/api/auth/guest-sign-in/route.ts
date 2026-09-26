import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Predefined accounts in DB and Clerk for instant demo access
const DEMO_ACCOUNTS = {
	admin: {
		userId: "user_2en3zzJ99KXQVXxruhBwA7etC9e",
		name: "Test Admin",
		email: "testAdmin@example.com",
		imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TestAdmin",
	},
	member: {
		userId: "user_2iJpIBBxaKUNAqpWvSmKtPnShFs",
		name: "Test Participant",
		email: "testParticipant@example.com",
		imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TestParticipant",
	},
};

export async function POST(req: Request) {
	try {
		let persona: "admin" | "member" = "admin";
		try {
			const body = await req.json();
			if (body?.persona === "member") {
				persona = "member";
			}
		} catch {
			// fallback to admin if body is empty
		}

		const target = DEMO_ACCOUNTS[persona];

		// Ensure profile exists in Postgres database
		let profile = await db.profile.findUnique({
			where: {
				userId: target.userId,
			},
		});

		if (!profile) {
			profile = await db.profile.create({
				data: {
					userId: target.userId,
					name: target.name,
					email: target.email,
					imageUrl: target.imageUrl,
				},
			});
		} else if (
			profile.email !== target.email ||
			profile.name !== target.name ||
			profile.imageUrl !== target.imageUrl
		) {
			profile = await db.profile.update({
				where: { id: profile.id },
				data: {
					name: target.name,
					email: target.email,
					imageUrl: target.imageUrl,
				},
			});
		}

		// Generate Clerk single-use sign-in ticket for official session hydration
		let clerkSignInToken: string | null = null;
		try {
			const tokenObj = await clerkClient.signInTokens.createSignInToken({
				userId: target.userId,
				expiresInSeconds: 3600,
			});
			clerkSignInToken = tokenObj.token;
		} catch (err) {
			console.warn("[GUEST_AUTH] Clerk signInToken fallback:", err);
		}

		// Find server where this profile belongs
		let server = await db.server.findFirst({
			where: {
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		if (!server) {
			// Fall back to any existing server or general
			server = await db.server.findFirst({
				orderBy: {
					createdAt: "asc",
				},
			});
		}

		const redirectUrl = server ? `/servers/${server.id}` : "/";

		const response = NextResponse.json({
			success: true,
			token: clerkSignInToken,
			redirectUrl,
			user: {
				id: profile.id,
				userId: profile.userId,
				name: profile.name,
				email: profile.email,
				role: persona === "admin" ? "Server Admin (Full Access)" : "Community Member",
			},
		});

		// Set demo auth cookies for zero-friction browser sessions
		const isProd = process.env.NODE_ENV === "production";
		const maxAge = 60 * 60 * 24 * 7; // 7 days

		response.cookies.set("guest_mode", "true", {
			path: "/",
			maxAge,
			sameSite: "lax",
			secure: isProd,
		});

		response.cookies.set("demo_user_id", target.userId, {
			path: "/",
			maxAge,
			httpOnly: true,
			sameSite: "lax",
			secure: isProd,
		});

		response.cookies.set("guest_account_name", profile.name, {
			path: "/",
			maxAge,
			sameSite: "lax",
			secure: isProd,
		});

		response.cookies.set("guest_persona", persona, {
			path: "/",
			maxAge,
			sameSite: "lax",
			secure: isProd,
		});

		return response;
	} catch (error) {
		console.error("[GUEST_SIGN_IN_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to authenticate guest account" },
			{ status: 500 }
		);
	}
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, email, imageUrl } = body;

		if (!name || typeof name !== "string" || !name.trim()) {
			return NextResponse.json(
				{ error: "Account display name is required" },
				{ status: 400 }
			);
		}

		const cleanEmail =
			email && typeof email === "string" && email.trim()
				? email.trim().toLowerCase()
				: `${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "user"}_${Date.now().toString().slice(-4)}@discord.demo`;

		// Check if profile with email exists
		let profile = await db.profile.findFirst({
			where: {
				email: cleanEmail,
			},
		});

		const defaultAvatar =
			imageUrl ||
			`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

		if (!profile) {
			const newUserId = `user_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
			profile = await db.profile.create({
				data: {
					userId: newUserId,
					name: name.trim(),
					email: cleanEmail,
					imageUrl: defaultAvatar,
				},
			});
		} else if (imageUrl || name) {
			profile = await db.profile.update({
				where: { id: profile.id },
				data: {
					name: name.trim(),
					imageUrl: defaultAvatar,
				},
			});
		}

		// Find or join the primary community server
		const primaryServer = await db.server.findFirst({
			orderBy: {
				createdAt: "asc",
			},
		});

		if (primaryServer) {
			const existingMember = await db.member.findFirst({
				where: {
					serverId: primaryServer.id,
					profileId: profile.id,
				},
			});

			if (!existingMember) {
				await db.member.create({
					data: {
						role: "GUEST",
						serverId: primaryServer.id,
						profileId: profile.id,
					},
				});
			}
		}

		const redirectUrl = primaryServer ? `/servers/${primaryServer.id}` : "/";

		const response = NextResponse.json({
			success: true,
			redirectUrl,
			profile: {
				id: profile.id,
				userId: profile.userId,
				name: profile.name,
				email: profile.email,
				imageUrl: profile.imageUrl,
			},
		});

		// Set auth session cookies
		const isProd = process.env.NODE_ENV === "production";
		const maxAge = 60 * 60 * 24 * 7; // 7 days

		response.cookies.set("guest_mode", "true", {
			path: "/",
			maxAge,
			sameSite: "lax",
			secure: isProd,
		});

		response.cookies.set("demo_user_id", profile.userId, {
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

		response.cookies.set("guest_persona", "custom", {
			path: "/",
			maxAge,
			sameSite: "lax",
			secure: isProd,
		});

		return response;
	} catch (error) {
		console.error("[CUSTOM_ACCOUNT_REGISTER_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to create custom account" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const profiles = await db.profile.findMany({
			take: 10,
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				userId: true,
				name: true,
				email: true,
				imageUrl: true,
			},
		});

		return NextResponse.json({ profiles });
	} catch (error) {
		console.error("[CUSTOM_ACCOUNT_LIST_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to fetch accounts" },
			{ status: 500 }
		);
	}
}

import { currentUser } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const initialProfile = async () => {
	let user = null;
	try {
		user = await currentUser();
	} catch {
		user = null;
	}

	if (user) {
		const profile = await db.profile.findUnique({
			where: {
				userId: user.id,
			},
		});

		if (profile) {
			return profile;
		}

		const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
		const email = user.emailAddresses?.[0]?.emailAddress || "user@example.com";

		const newProfile = await db.profile.create({
			data: {
				userId: user.id,
				name: fullName,
				imageUrl: user.imageUrl || "",
				email: email,
			},
		});
		return newProfile;
	}

	// Check if guest demo cookie exists
	try {
		const cookieStore = cookies();
		const demoUserId = cookieStore.get("demo_user_id")?.value;
		if (demoUserId) {
			const demoProfile = await db.profile.findUnique({
				where: {
					userId: demoUserId,
				},
			});
			if (demoProfile) {
				return demoProfile;
			}
		}
	} catch {
		// cookies() may not be available in non-request contexts
	}

	// Fallback if not authenticated via Clerk: return existing profile or create primary user
	const existingProfile = await db.profile.findFirst({
		orderBy: {
			createdAt: "asc",
		},
	});

	if (existingProfile) {
		if (
			existingProfile.userId === "user_2en3zzJ99KXQVXxruhBwA7etC9e" &&
			(existingProfile.email !== "testAdmin@example.com" ||
				existingProfile.name !== "Test Admin")
		) {
			try {
				return await db.profile.update({
					where: { id: existingProfile.id },
					data: {
						name: "Test Admin",
						email: "testAdmin@example.com",
						imageUrl:
							"https://api.dicebear.com/7.x/bottts/svg?seed=TestAdmin",
					},
				});
			} catch (e) {
				console.error("Failed to update testAdmin in initialProfile:", e);
			}
		}
		return existingProfile;
	}

	return await db.profile.create({
		data: {
			userId: "user_2en3zzJ99KXQVXxruhBwA7etC9e",
			name: "Test Admin",
			imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TestAdmin",
			email: "testAdmin@example.com",
		},
	});
};

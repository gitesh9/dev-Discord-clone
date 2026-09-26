import { auth } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const currentProfile = async () => {
	let userId: string | null = null;
	try {
		const authResult = auth();
		userId = authResult?.userId || null;
	} catch {
		userId = null;
	}

	if (!userId) {
		try {
			const cookieStore = cookies();
			const demoUserId = cookieStore.get("demo_user_id")?.value;
			if (demoUserId) {
				userId = demoUserId;
			}
		} catch {
			// cookies() may not be available in non-request contexts
		}
	}

	if (userId) {
		let profile = await db.profile.findUnique({
			where: {
				userId,
			},
		});
		if (profile) {
			if (
				userId === "user_2en3zzJ99KXQVXxruhBwA7etC9e" &&
				(profile.email !== "testAdmin@example.com" ||
					profile.name !== "Test Admin")
			) {
				try {
					profile = await db.profile.update({
						where: { id: profile.id },
						data: {
							name: "Test Admin",
							email: "testAdmin@example.com",
							imageUrl:
								"https://api.dicebear.com/7.x/bottts/svg?seed=TestAdmin",
						},
					});
				} catch (e) {
					console.error("Failed to update testAdmin profile:", e);
				}
			} else if (
				userId === "user_2iJpIBBxaKUNAqpWvSmKtPnShFs" &&
				(profile.email !== "testParticipant@example.com" ||
					profile.name !== "Test Participant")
			) {
				try {
					profile = await db.profile.update({
						where: { id: profile.id },
						data: {
							name: "Test Participant",
							email: "testParticipant@example.com",
							imageUrl:
								"https://api.dicebear.com/7.x/bottts/svg?seed=TestParticipant",
						},
					});
				} catch (e) {
					console.error("Failed to update testParticipant profile:", e);
				}
			}
			return profile;
		}
	}

	return null;
};

import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import { db } from "@/lib/db";

export const currentProfilePages = async (req: NextApiRequest) => {
	let userId: string | null = null;
	try {
		const authResult = getAuth(req);
		userId = authResult?.userId || null;
	} catch {
		userId = null;
	}

	if (!userId && req.cookies?.demo_user_id) {
		userId = req.cookies.demo_user_id;
	}

	if (userId) {
		const profile = await db.profile.findUnique({
			where: {
				userId,
			},
		});
		if (profile) return profile;
	}

	return null;
};

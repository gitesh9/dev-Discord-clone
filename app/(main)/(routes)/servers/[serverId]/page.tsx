import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdProps {
	params: {
		serverId: string;
	};
}
const ServerIdPage = async ({ params }: ServerIdProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	let initialChannel = server?.channels?.[0];
	if (!initialChannel) {
		const anyChannel = await db.channel.findFirst({
			where: {
				serverId: params.serverId,
			},
			orderBy: {
				createdAt: "asc",
			},
		});
		initialChannel = anyChannel || undefined;
	}

	if (!initialChannel) {
		return null;
	}

	return redirect(
		`/servers/${params.serverId}/channels/${initialChannel.id}`
	);
};

export default ServerIdPage;

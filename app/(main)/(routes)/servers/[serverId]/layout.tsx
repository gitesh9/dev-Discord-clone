import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { ResizableServerLayout } from "@/components/server/resizable-server-layout";

const ServerIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { serverId: string };
}) => {
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
	});

	if (!server) {
		return redirect("/");
	}

	return (
		<ResizableServerLayout
			sidebar={<ServerSidebar serverId={params.serverId} />}
		>
			{children}
		</ResizableServerLayout>
	);
};

export default ServerIdLayout;

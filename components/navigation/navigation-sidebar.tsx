import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { NavigationUserButton } from "./navigation-user-button";

export const NavigationSidebar = async () => {
	const profile = await currentProfile();

	if (!profile) {
		return redirect("/");
	}
	const servers = await db.server.findMany({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});
	return (
		<div
			className="server-rail space-y-3 flex flex-col items-center h-full text-primary w-full py-3"
		>
			<NavigationAction />
			<Separator className="h-px bg-white/10 w-8 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers.map((server) => (
					<div key={server.id} className="mb-4">
						<NavigationItem
							id={server.id}
							imageUrl={server.imageUrl}
							name={server.name}
						></NavigationItem>
					</div>
				))}
			</ScrollArea>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<NavigationUserButton
					fallbackImageUrl={profile.imageUrl}
					fallbackName={profile.name}
				/>
			</div>
		</div>
	);
};

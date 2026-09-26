import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0 flex gap-0 w-[312px] sm:w-[332px] max-w-[85vw] border-r-0 bg-[#2B2D31]">
				<div className="w-[72px] shrink-0">
					<NavigationSidebar />
				</div>
				<div className="flex-1 overflow-hidden">
					<ServerSidebar serverId={serverId} />
				</div>
			</SheetContent>
		</Sheet>
	);
};

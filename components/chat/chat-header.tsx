import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "channel" | "conversation";
	imageUrl?: string;
}

export const ChatHeader = ({
	serverId,
	name,
	type,
	imageUrl,
}: ChatHeaderProps) => {
	return (
		<div className="chat-heading px-4 flex items-center h-14 border-b border-white/[0.06]">
			<MobileToggle serverId={serverId} />
			{type === "channel" && (
				<Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
			)}
			{type === "conversation" && (
				<UserAvatar
					src={imageUrl}
					className="h-8 w-8 md:h-8 md:w-8 mr-2"
				/>
			)}
			<p className="font-display font-semibold text-[15px] text-foreground">
				{name}
			</p>
			<div className="ml-auto flex items-center gap-x-2 header-tools">
				{type === "conversation" && <ChatVideoButton />}
				<SocketIndicator />
			</div>
		</div>
	);
};

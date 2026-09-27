"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionToolTip } from "@/components/action-tootltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
	channel,
	server,
	role,
}: ServerChannelProps) => {
	const { onOpen } = useModal();
	const params = useParams();
	const router = useRouter();

	const Icon = iconMap[channel.type];

	const onClick = () => {
		router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
	};

	const onAction = (e: React.MouseEvent, action: ModalType) => {
		e.stopPropagation();
		onOpen(action, { channel, server });
	};

	const channelTypeLabel =
		channel.type === ChannelType.TEXT
			? `Text Channel · #${channel.name}`
			: channel.type === ChannelType.AUDIO
			? `Voice Room · ${channel.name} (LiveKit WebRTC)`
			: `Video Room · ${channel.name} (Screen share & camera)`;

	return (
		<ActionToolTip side="right" align="center" label={channelTypeLabel}>
			<button
				onClick={onClick}
				className={cn(
					"channel-item group px-2.5 py-2 rounded-lg flex items-center gap-x-2 w-full transition mb-0.5 border border-transparent",
					params?.channelId === channel.id &&
						"active-channel bg-primary/10 border-primary/15"
				)}
			>
				<Icon className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
				<p
					className={cn(
						"line-clamp-1 font-medium text-[13px] text-muted-foreground group-hover:text-foreground transition text-left flex-1",
						params?.channelId == channel.id &&
							"text-foreground"
					)}
				>
					{channel.name}
				</p>
				{channel.name !== "general" && role !== MemberRole.GUEST && (
					<div className="ml-auto flex items-center gap-x-2">
						<ActionToolTip label="Edit Channel">
							<Edit
								onClick={(e) => onAction(e, "editChannel")}
								className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
							/>
						</ActionToolTip>
						<ActionToolTip label="Delete Channel">
							<Trash
								onClick={(e) => onAction(e, "deleteChannel")}
								className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
							/>
						</ActionToolTip>
					</div>
				)}
				{channel.name === "general" && (
					<Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
				)}
			</button>
		</ActionToolTip>
	);
};

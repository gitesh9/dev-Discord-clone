"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tootltip";

interface ServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
	const params = useParams();
	const router = useRouter();

	const icon = roleIconMap[member.role];

	const onClick = () => {
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};

	return (
		<ActionToolTip
			side="right"
			align="center"
			label={`Direct Message: Chat 1:1 with ${member.profile.name}`}
		>
			<button
				onClick={onClick}
				className={cn(
					"member-item group px-2 py-1.5 rounded-lg flex items-center gap-x-2 w-full transition mb-0.5 text-left border border-transparent",
					params?.memberId === member.id &&
						"bg-white/5 border-white/5"
				)}
			>
				<UserAvatar
					src={member.profile.imageUrl}
					className="h-8 w-8 md:h-8 md:w-8"
				/>
				<p
					className={cn(
						"font-medium text-[13px] text-muted-foreground group-hover:text-foreground transition truncate flex-1",
						params?.memberId === member.id &&
							"text-foreground"
					)}
				>
					{member.profile.name}
				</p>
				{icon}
			</button>
		</ActionToolTip>
	);
};

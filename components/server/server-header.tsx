"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
	ChevronDown,
	HelpCircle,
	LogOut,
	PlusCircle,
	Settings,
	Sparkles,
	Trash,
	UserPlus,
	Users,
	Compass,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { useQuickGuide } from "@/hooks/use-quick-guide";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
	const { onOpen } = useModal();
	const { openGuide } = useQuickGuide();
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button
					data-tour="server-header"
					className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
				>
					<span className="truncate">{server.name}</span>
					<ChevronDown className="h-5 w-5 ml-auto shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60 text-xs font-medium text-zinc-800 dark:text-zinc-300 bg-white dark:bg-[#111214] border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg p-1.5 space-y-0.5">
				{/* Recruiter quick guide access */}
				<DropdownMenuItem
					onClick={() => openGuide(0)}
					className="text-[#5865F2] dark:text-indigo-400 px-3 py-2 text-xs cursor-pointer font-medium rounded-md hover:bg-indigo-500/10 focus:bg-indigo-500/10"
				>
					<Compass className="h-4 w-4 mr-2" />
					Step-by-Step UI Tour
				</DropdownMenuItem>

				<DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />

				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen("invite", { server })}
						className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-xs cursor-pointer rounded-md hover:bg-indigo-500/10 focus:bg-indigo-500/10"
					>
						Invite People
						<UserPlus className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen("editServer", { server })}
						className="px-3 py-2 text-xs cursor-pointer rounded-md"
					>
						Server Settings
						<Settings className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen("members", { server })}
						className="px-3 py-2 text-xs cursor-pointer rounded-md"
					>
						Manage Members
						<Users className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen("createChannel", { server })}
						className="px-3 py-2 text-xs cursor-pointer rounded-md"
					>
						Create Channel
						<PlusCircle className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen("deleteServer", { server })}
						className="text-rose-500 px-3 py-2 text-xs cursor-pointer rounded-md hover:bg-rose-500/10 focus:bg-rose-500/10"
					>
						Delete Server
						<Trash className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen("leaveServer", { server })}
						className="text-rose-500 px-3 py-2 text-xs cursor-pointer rounded-md hover:bg-rose-500/10 focus:bg-rose-500/10"
					>
						Leave Server
						<LogOut className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

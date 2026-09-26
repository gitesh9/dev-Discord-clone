"use client";

import axios from "axios";
import qs from "query-string";
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
	Users,
} from "lucide-react";
import { useState } from "react";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuTrigger,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const MembersModal = () => {
	const router = useRouter();
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState("");

	const isModalOpen = isOpen && type === "members";
	const { server } = data as { server: ServerWithMembersWithProfiles };

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const response = await axios.patch(url, { role });
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const response = await axios.delete(url);
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-zinc-900 dark:text-zinc-100 overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-2xl">
				<DialogHeader className="pt-8 px-6">
					<div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-2">
						<Users className="w-6 h-6 text-[#5865F2]" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Manage Members
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-400 text-xs">
						{server?.members?.length} active {server?.members?.length === 1 ? "member" : "members"} in server
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-6 max-h-[420px] px-6">
					{server?.members?.map((member) => (
						<div
							key={member.id}
							className="flex items-center gap-x-3 p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#2B2D31]/80 transition mb-2"
						>
							<UserAvatar src={member.profile.imageUrl} className="h-10 w-10 md:h-10 md:w-10" />
							<div className="flex flex-col gap-y-0.5">
								<div className="text-sm font-semibold flex items-center gap-x-1 text-zinc-900 dark:text-zinc-100">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
									{member.profile.email}
								</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger className="focus:outline-none p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
												<MoreVertical className="h-4 w-4 text-zinc-500" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left" className="bg-white dark:bg-[#2B2D31] border-zinc-200 dark:border-zinc-700">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex items-center text-xs">
														<ShieldQuestion className="w-4 h-4 mr-2" />
														<span>Assign Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent className="bg-white dark:bg-[#2B2D31] border-zinc-200 dark:border-zinc-700">
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(
																		member.id,
																		"GUEST"
																	)
																}
																className="text-xs cursor-pointer"
															>
																<Shield className="h-4 w-4 mr-2 text-zinc-400" />
																Guest
																{member.role ===
																	"GUEST" && (
																	<Check className="h-4 w-4 ml-auto text-emerald-500" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(
																		member.id,
																		"MODERATOR"
																	)
																}
																className="text-xs cursor-pointer"
															>
																<ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
																Moderator
																{member.role ===
																	"MODERATOR" && (
																	<Check className="h-4 w-4 ml-auto text-emerald-500" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-700" />
												<DropdownMenuItem
													onClick={() =>
														onKick(member.id)
													}
													className="text-rose-500 text-xs cursor-pointer focus:text-rose-500"
												>
													<Gavel className="h-4 w-4 mr-2" />
													Kick Member
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

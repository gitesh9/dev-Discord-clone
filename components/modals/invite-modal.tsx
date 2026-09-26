"use client";

import axios from "axios";
import { useState } from "react";
import { Check, Copy, RefreshCw, Sparkles, UserPlus } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const origin = useOrigin();

	const isModalOpen = isOpen && type === "invite";
	const { server } = data;

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	const onNew = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(
				`/api/servers/${server?.id}/invite-code`
			);
			onOpen("invite", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-2xl">
				<DialogHeader className="pt-8 px-6">
					<div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-2">
						<UserPlus className="w-6 h-6 text-[#5865F2]" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Invite Friends
					</DialogTitle>
					<p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-1">
						Share this unique invite link with friends, team members, or colleagues to give them instant access.
					</p>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-600 dark:text-zinc-300">
						Server invite link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							readOnly
							className="bg-zinc-100 dark:bg-[#1E1F22] border-0 focus-visible:ring-2 focus-visible:ring-[#5865F2] text-zinc-800 dark:text-zinc-200 focus-visible:ring-offset-0 text-xs font-mono select-all"
							value={inviteUrl}
						/>
						<Button
							disabled={isLoading}
							onClick={onCopy}
							size="icon"
							variant={copied ? "primary" : "secondary"}
							className="transition shrink-0"
						>
							{copied ? (
								<Check className="w-4 h-4 text-emerald-400" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>

					<div className="flex items-center justify-between mt-4">
						<Button
							disabled={isLoading}
							onClick={onNew}
							variant="link"
							size="sm"
							className="text-xs text-zinc-500 hover:text-[#5865F2] dark:text-zinc-400 dark:hover:text-indigo-400 p-0"
						>
							Generate a new unique link
							<RefreshCw className="w-3.5 h-3.5 ml-1.5" />
						</Button>

						{copied && (
							<span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
								<Check className="w-3 h-3" /> Copied to clipboard!
							</span>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

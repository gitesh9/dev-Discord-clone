"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

export const LeaveServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "leaveServer";
	const { server } = data;

	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			await axios.patch(`/api/servers/${server?.id}/leave`);
			onClose();
			router.refresh();
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
					<div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center mb-2">
						<LogOut className="w-6 h-6 text-rose-500" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Leave Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-400 text-xs mt-1">
						Are you sure you want to leave{" "}
						<span className="font-semibold text-zinc-800 dark:text-zinc-200">
							{server?.name}
						</span>
						? You will need an invite link to rejoin this server.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-zinc-100 dark:bg-[#2B2D31] px-6 py-4 flex items-center justify-between">
					<Button
						disabled={isLoading}
						onClick={onClose}
						variant="ghost"
						className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
					>
						Cancel
					</Button>
					<Button
						disabled={isLoading}
						onClick={onClick}
						variant="destructive"
						className="bg-rose-600 hover:bg-rose-700 text-white"
					>
						Leave Server
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

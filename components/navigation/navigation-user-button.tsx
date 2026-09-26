"use client";

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tootltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Compass, LogOut, ShieldAlert, Sparkles, User, UserPlus, LogIn } from "lucide-react";
import { useQuickGuide } from "@/hooks/use-quick-guide";

interface NavigationUserButtonProps {
	fallbackImageUrl?: string;
	fallbackName?: string;
}

export const NavigationUserButton = ({
	fallbackImageUrl,
	fallbackName = "User",
}: NavigationUserButtonProps) => {
	const router = useRouter();
	const { isSignedIn } = useUser();
	const { signOut } = useClerk();
	const { openGuide } = useQuickGuide();

	const handleExitDemo = async () => {
		try {
			await fetch("/api/auth/guest-sign-out", { method: "POST" });
			if (typeof window !== "undefined") {
				localStorage.removeItem("is_guest_account");
				localStorage.removeItem("guest_persona");
				localStorage.removeItem("guest_user_name");
			}
			if (isSignedIn) {
				await signOut();
			}
		} catch {
			// ignore
		}
		router.push("/sign-in");
		router.refresh();
	};

	if (isSignedIn) {
		return (
			<UserButton
				afterSignOutUrl="/sign-in"
				appearance={{
					elements: { avatarBox: "h-[48px] w-[48px]" },
				}}
			/>
		);
	}

	return (
		<DropdownMenu>
			<ActionTooltip side="right" align="center" label={`${fallbackName} (Demo Account)`}>
				<DropdownMenuTrigger asChild>
					<div className="cursor-pointer group flex items-center relative">
						<UserAvatar
							src={fallbackImageUrl}
							className="h-[48px] w-[48px] group-hover:rounded-[16px] transition-all rounded-[24px] border-2 border-indigo-500/40"
						/>
						<span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1E1F22] rounded-full" />
					</div>
				</DropdownMenuTrigger>
			</ActionTooltip>

			<DropdownMenuContent
				side="right"
				align="end"
				className="w-56 bg-[#2B2D31] text-white border-zinc-700/80 p-1.5 shadow-xl"
			>
				<DropdownMenuLabel className="font-normal p-2">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-semibold leading-none text-white truncate">
							{fallbackName}
						</p>
						<p className="text-[11px] leading-none text-indigo-400 font-medium flex items-center gap-1 pt-1">
							<Sparkles className="w-3 h-3 text-amber-400" />
							Guest Demo · Server Owner
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-zinc-700/60" />
				<DropdownMenuItem
					onClick={() => router.push("/sign-up")}
					className="text-xs cursor-pointer focus:bg-[#5865F2] focus:text-white"
				>
					<UserPlus className="w-4 h-4 mr-2 text-indigo-400" />
					Register New Account
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push("/sign-in")}
					className="text-xs cursor-pointer focus:bg-[#5865F2] focus:text-white"
				>
					<LogIn className="w-4 h-4 mr-2 text-emerald-400" />
					Switch Account / Sign In
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-zinc-700/60" />
				<DropdownMenuItem
					onClick={() => openGuide(0)}
					className="text-xs cursor-pointer focus:bg-[#5865F2] focus:text-white"
				>
					<Compass className="w-4 h-4 mr-2 text-[#5865F2]" />
					Step-by-Step UI Tour
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-zinc-700/60" />
				<DropdownMenuItem
					onClick={handleExitDemo}
					className="text-xs text-rose-400 hover:text-rose-300 focus:bg-rose-600/30 focus:text-rose-300 cursor-pointer"
				>
					<LogOut className="w-4 h-4 mr-2" />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

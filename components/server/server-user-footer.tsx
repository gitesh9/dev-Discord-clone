"use client";

import { useState, useEffect } from "react";
import { MemberRole, Profile } from "@prisma/client";
import {
	Check,
	Headphones,
	HelpCircle,
	LogOut,
	Mic,
	MicOff,
	Settings,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	VolumeX,
	UserPlus,
	LogIn,
	Compass,
} from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tootltip";
import { useQuickGuide } from "@/hooks/use-quick-guide";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ServerUserFooterProps {
	profile: Profile;
	role?: MemberRole;
}

export const ServerUserFooter = ({ profile, role }: ServerUserFooterProps) => {
	const [isMuted, setIsMuted] = useState(false);
	const [isDeafened, setIsDeafened] = useState(false);
	const [isGuest, setIsGuest] = useState(false);
	const { openGuide } = useQuickGuide();

	useEffect(() => {
		try {
			const guestFlag = localStorage.getItem("is_guest_account");
			const cookieGuest = document.cookie.includes("guest_mode=true");
			setIsGuest(guestFlag === "true" || cookieGuest || true); // Always clarify demo status for recruiter confidence
		} catch {
			setIsGuest(true);
		}
	}, []);

	const handleSignOut = async () => {
		try {
			await fetch("/api/auth/guest-sign-out", { method: "POST" });
			if (typeof window !== "undefined") {
				localStorage.removeItem("is_guest_account");
				localStorage.removeItem("guest_persona");
				localStorage.removeItem("guest_user_name");
			}
		} catch {
			// ignore
		}
		window.location.href = "/sign-in";
	};

	return (
		<div
			data-tour="user-footer"
			className="server-user-footer px-2.5 py-2.5 flex items-center gap-x-2 border-t border-white/[0.06] mt-auto"
		>
			{/* User Avatar + Status */}
			<div className="relative group cursor-pointer">
				<UserAvatar
					src={profile.imageUrl}
					className="h-8 w-8 rounded-full border border-zinc-700"
				/>
				{/* Green Online Dot */}
				<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#232428] rounded-full" />
			</div>

			{/* User Info & Demo Badge */}
			<div className="flex flex-col min-w-0 flex-1 cursor-pointer">
				<div className="flex items-center gap-1">
					<p className="text-xs font-semibold text-zinc-100 truncate">
						{profile.name}
					</p>
					{role === MemberRole.ADMIN && (
						<ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
					)}
					{role === MemberRole.MODERATOR && (
						<ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0" />
					)}
				</div>
				<div className="flex items-center gap-1">
					<span className="text-[10px] text-indigo-400 font-medium flex items-center gap-0.5 truncate">
						<Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
						Guest Demo · {role || "ADMIN"}
					</span>
				</div>
			</div>

			{/* Quick Action Icons */}
			<div className="flex items-center gap-0.5">
				{/* Mic Toggle */}
				<ActionToolTip label={isMuted ? "Unmute Mic" : "Mute Mic"}>
					<button
						onClick={() => setIsMuted(!isMuted)}
						className={`p-1.5 rounded hover:bg-zinc-700/60 transition ${
							isMuted ? "text-rose-500" : "text-zinc-400 hover:text-zinc-200"
						}`}
						aria-label="Toggle Microphone"
					>
						{isMuted ? (
							<MicOff className="w-4 h-4" />
						) : (
							<Mic className="w-4 h-4" />
						)}
					</button>
				</ActionToolTip>

				{/* Deafen Toggle */}
				<ActionToolTip
					label={isDeafened ? "Undeafen Audio" : "Deafen Audio"}
				>
					<button
						onClick={() => setIsDeafened(!isDeafened)}
						className={`p-1.5 rounded hover:bg-zinc-700/60 transition ${
							isDeafened
								? "text-rose-500"
								: "text-zinc-400 hover:text-zinc-200"
						}`}
						aria-label="Toggle Deafen"
					>
						{isDeafened ? (
							<VolumeX className="w-4 h-4" />
						) : (
							<Headphones className="w-4 h-4" />
						)}
					</button>
				</ActionToolTip>

				{/* Quick Guide Tour Trigger */}
				<ActionToolTip label="Recruiter Quick Guide & Tour">
					<button
						onClick={() => openGuide(0)}
						className="p-1.5 rounded hover:bg-zinc-700/60 text-zinc-400 hover:text-[#5865F2] transition"
						aria-label="Open Quick Guide"
					>
						<HelpCircle className="w-4 h-4 text-[#5865F2]" />
					</button>
				</ActionToolTip>

				{/* Account / Demo Settings Popover */}
				<Popover>
					<ActionToolTip label="Demo Account Settings">
						<PopoverTrigger asChild>
							<button
								className="p-1.5 rounded hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition"
								aria-label="Account Settings"
							>
								<Settings className="w-4 h-4" />
							</button>
						</PopoverTrigger>
					</ActionToolTip>

					<PopoverContent
						side="top"
						align="end"
						className="w-64 p-3 bg-[#1E1F22] border-zinc-700 text-white shadow-xl space-y-3"
					>
						<div className="space-y-1">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
								<Sparkles className="w-3.5 h-3.5 text-amber-400" />
								<span>Guest Demo Session</span>
							</div>
							<p className="text-[11px] text-zinc-400 leading-relaxed">
								You are exploring as <strong>{profile.name}</strong> with{" "}
								<strong>{role || "ADMIN"}</strong> role permissions.
							</p>
						</div>

						<div className="p-2 rounded bg-zinc-800/80 border border-zinc-700/60 text-[11px] space-y-1 text-zinc-300">
							<div className="flex justify-between">
								<span className="text-zinc-400">Status:</span>
								<span className="text-emerald-400 font-medium">Active Demo</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-400">Role:</span>
								<span className="text-indigo-400 font-medium">{role || "ADMIN"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-400">WebSockets:</span>
								<span className="text-emerald-400 font-medium">Connected</span>
							</div>
						</div>

						<div className="space-y-1.5 pt-1">
							<Button
								variant="outline"
								size="sm"
								onClick={() => { window.location.href = "/sign-up"; }}
								className="w-full text-xs h-8 border-zinc-700 hover:bg-zinc-800 text-zinc-200 justify-start"
							>
								<UserPlus className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
								Register New Account
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => { window.location.href = "/sign-in"; }}
								className="w-full text-xs h-8 border-zinc-700 hover:bg-zinc-800 text-zinc-200 justify-start"
							>
								<LogIn className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
								Switch Account / Sign In
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => openGuide(0)}
								className="w-full text-xs h-8 border-zinc-700 hover:bg-zinc-800 text-zinc-200 justify-start"
							>
								<Compass className="w-3.5 h-3.5 mr-1.5 text-[#5865F2]" />
								Step-by-Step UI Tour
							</Button>

							<Button
								variant="destructive"
								size="sm"
								onClick={handleSignOut}
								className="w-full text-xs h-8 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-600/30 justify-start"
							>
								<LogOut className="w-3.5 h-3.5 mr-1.5" />
								Sign Out
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};

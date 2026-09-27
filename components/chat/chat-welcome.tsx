"use client";

import { Hash, Sparkles, MessageSquare, Video, Mic, Compass, Lightbulb, MousePointerClick, ShieldCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useQuickGuide } from "@/hooks/use-quick-guide";
import { ActionToolTip } from "@/components/action-tootltip";

interface ChatWelcomeProps {
	name: string;
	type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
	const router = useRouter();
	const params = useParams();
	const { openGuide } = useQuickGuide();

	const handleAction = (action: string) => {
		if (action === "guide") {
			openGuide(0);
		} else if (action === "voice") {
			router.push(`/servers/${params?.serverId}/channels/77f0ccd2-5d97-4302-897d-4c01b1d6b355`);
		} else if (action === "video") {
			router.push(`/servers/${params?.serverId}/channels/7f783e8c-98b8-4181-82ed-16271c54231e`);
		} else if (action === "dm") {
			router.push(`/servers/${params?.serverId}/conversations/fea7aec7-9dbb-410e-95af-3a6a53dcfd1b`);
		}
	};

	return (
		<div className="welcome-state space-y-5 px-5 mb-6 max-w-5xl">
			{type === "channel" && (
				<div className="flex items-center gap-4">
					<div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
						<Hash className="h-7 w-7 text-primary" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
								Welcome to #{name}!
							</h1>
							<span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-[#5865F2]/10 text-[#5865F2] dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
								<Sparkles className="w-3 h-3" />
								Socket.io Real-time Channel
							</span>
						</div>
						<p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-0.5">
							This is the start of the #{name} channel. Messages are broadcasted in real time via WebSockets.
						</p>
					</div>
				</div>
			)}

			{type === "conversation" && (
				<div>
					<h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
						Conversation with {name}
					</h1>
					<p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-0.5">
						This is the start of your 1:1 direct message history with {name}. Private messages and 1:1 video calls are supported.
					</p>
				</div>
			)}

			{/* Organic Inline Tips & Empty State Guidance */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
				<div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
					<div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
						<Lightbulb className="w-3.5 h-3.5 text-amber-400" />
						<span>Real-Time Sync</span>
					</div>
					<p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
						Messages and channel creations broadcast instantaneously to all open tabs with Socket.io.
					</p>
				</div>

				<div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
					<div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
						<MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />
						<span>Hover for Controls</span>
					</div>
					<p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
						Hover directly over any message you have posted to reveal instant Edit and Delete actions.
					</p>
				</div>

				<div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
					<div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
						<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
						<span>Test Personas</span>
					</div>
					<p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
						Switch between <strong>Test Admin</strong> and <strong>Test Participant</strong> in the footer to evaluate permissions.
					</p>
				</div>
			</div>

			{/* Quick Action Navigation Chips */}
			{type === "channel" && (
				<div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] space-y-2.5 backdrop-blur-xl">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
							<Sparkles className="w-3.5 h-3.5 text-[#5865F2]" />
							Quick Evaluation Starters
						</span>
						<span className="text-[10px] text-zinc-500 dark:text-zinc-400">
							Click any action to test live features
						</span>
					</div>

					<div className="flex flex-wrap gap-2 pt-0.5">
						<ActionToolTip label="Test LiveKit WebRTC persistent voice room">
							<button
								onClick={() => handleAction("voice")}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1F22] border border-zinc-200 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 hover:text-[#5865F2] dark:hover:text-indigo-400 hover:border-indigo-500/50 text-xs font-medium transition shadow-xs"
							>
								<Mic className="w-3.5 h-3.5 text-emerald-500" />
								Join Voice Lounge
							</button>
						</ActionToolTip>

						<ActionToolTip label="Test LiveKit WebRTC video conferencing with camera & screen share">
							<button
								onClick={() => handleAction("video")}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1F22] border border-zinc-200 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 hover:text-[#5865F2] dark:hover:text-indigo-400 hover:border-indigo-500/50 text-xs font-medium transition shadow-xs"
							>
								<Video className="w-3.5 h-3.5 text-indigo-500" />
								Enter Video Room
							</button>
						</ActionToolTip>

						<ActionToolTip label="Open 1:1 direct message conversation with Test Participant">
							<button
								onClick={() => handleAction("dm")}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1F22] border border-zinc-200 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 hover:text-[#5865F2] dark:hover:text-indigo-400 hover:border-indigo-500/50 text-xs font-medium transition shadow-xs"
							>
								<MessageSquare className="w-3.5 h-3.5 text-amber-500" />
								Direct Message Test Participant
							</button>
						</ActionToolTip>

						<ActionToolTip label="Start step-by-step guided product tour">
							<button
								onClick={() => handleAction("guide")}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865F2]/10 dark:bg-[#5865F2]/20 border border-indigo-500/30 text-[#5865F2] dark:text-indigo-300 hover:bg-[#5865F2]/25 text-xs font-medium transition shadow-xs"
							>
								<Compass className="w-3.5 h-3.5 text-[#5865F2]" />
								Step-by-Step UI Tour
							</button>
						</ActionToolTip>
					</div>
				</div>
			)}
		</div>
	);
};

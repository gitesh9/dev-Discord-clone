"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2, AlertCircle, RefreshCw, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	const { user } = useUser();
	const [token, setToken] = useState("");
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchToken = async () => {
		try {
			setLoading(true);
			setError(false);

			let name = "Recruiter Demo User";
			if (user) {
				name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
			} else if (typeof window !== "undefined") {
				const guestName = localStorage.getItem("guest_user_name");
				if (guestName) {
					name = guestName;
				}
			}

			const resp = await fetch(
				`/api/livekit?room=${encodeURIComponent(chatId)}&username=${encodeURIComponent(name)}`
			);

			if (!resp.ok) {
				throw new Error("Failed to get LiveKit token");
			}

			const data = await resp.json();
			if (data.token) {
				setToken(data.token);
			} else {
				throw new Error("Empty token returned");
			}
		} catch (err) {
			console.error("[LIVEKIT_TOKEN_ERROR]", err);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, chatId]);

	if (loading) {
		return (
			<div className="flex flex-col flex-1 justify-center items-center h-full p-6 text-center">
				<div className="relative flex items-center justify-center mb-4">
					<div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse">
						<Radio className="w-7 h-7 text-[#5865F2]" />
					</div>
					<Loader2 className="h-14 w-14 text-[#5865F2] animate-spin absolute" />
				</div>
				<h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
					Connecting to LiveKit SFU Room
				</h3>
				<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
					Initializing WebRTC audio/video tracks and peer connections...
				</p>
			</div>
		);
	}

	if (error || !token) {
		return (
			<div className="flex flex-col flex-1 justify-center items-center h-full p-8 text-center bg-zinc-50 dark:bg-[#1E1F22]">
				<div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 mb-3">
					<AlertCircle className="w-6 h-6" />
				</div>
				<h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
					LiveKit Room Notice
				</h3>
				<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-md leading-relaxed">
					WebRTC video/voice calling requires active camera/mic permissions and a reachable LiveKit server. In sandbox or iframe environments without hardware media devices, audio/video preview may be simulated.
				</p>
				<div className="flex items-center gap-2 mt-5">
					<Button
						variant="primary"
						size="sm"
						onClick={fetchToken}
						className="flex items-center gap-1.5 text-xs font-medium"
					>
						<RefreshCw className="w-3.5 h-3.5" />
						Retry Connection
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="media-room flex flex-col flex-1 h-full overflow-hidden bg-background">
			{/* Top WebRTC status strip */}
			<div className="px-4 py-2.5 bg-white/[0.025] border-b border-white/[0.06] flex items-center justify-between text-xs text-muted-foreground backdrop-blur-xl">
				<div className="flex items-center gap-2">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
					<span className="font-medium text-zinc-200">
						LiveKit WebRTC Conference
					</span>
					<span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
						Room ID: {chatId.slice(0, 8)}...
					</span>
				</div>
				<div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
					<Sparkles className="w-3.5 h-3.5 text-indigo-400" />
					<span>End-to-End SFU Mesh</span>
				</div>
			</div>

			<div className="flex-1 relative overflow-hidden">
				<LiveKitRoom
					data-lk-theme="default"
					serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
					token={token}
					connect={true}
					video={video}
					audio={audio}
				>
					<VideoConference />
				</LiveKitRoom>
			</div>
		</div>
	);
};

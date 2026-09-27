"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { ActionToolTip } from "@/components/action-tootltip";
import { Radio } from "lucide-react";

export const SocketIndicator = () => {
	const { isConnected } = useSocket();

	if (!isConnected) {
		return (
			<ActionToolTip label="WebSocket connecting or falling back to HTTP 1s polling" side="bottom">
				<Badge
					variant="outline"
					className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium flex items-center gap-1.5 cursor-help transition"
				>
					<span className="w-2 h-2 rounded-full bg-amber-500" />
					<span>Connecting...</span>
				</Badge>
			</ActionToolTip>
		);
	}

	return (
		<ActionToolTip
			label="Real-time WebSocket transport active via Socket.io engine (Zero polling delay)"
			side="bottom"
		>
			<Badge
				variant="outline"
				className="sync-badge bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5 cursor-help transition rounded-lg"
			>
				<span className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
				</span>
				<span>Live Sync</span>
			</Badge>
		</ActionToolTip>
	);
};

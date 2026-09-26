"use client";

import { Compass } from "lucide-react";
import { ActionToolTip } from "@/components/action-tootltip";
import { useQuickGuide } from "@/hooks/use-quick-guide";

interface QuickGuideTriggerProps {
	variant?: "header" | "sidebar" | "button";
	className?: string;
}

export const QuickGuideTrigger = ({
	variant = "header",
	className = "",
}: QuickGuideTriggerProps) => {
	const { openGuide } = useQuickGuide();

	if (variant === "sidebar") {
		return (
			<ActionToolTip side="right" align="center" label="Step-by-Step UI Tour">
				<button
					onClick={() => openGuide(0)}
					className={`group flex items-center justify-center rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-background dark:bg-neutral-700 hover:bg-[#5865F2] hover:text-white dark:hover:bg-[#5865F2] h-[48px] w-[48px] text-zinc-500 dark:text-zinc-300 ${className}`}
					aria-label="Open Step-by-Step UI Tour"
				>
					<Compass className="h-6 w-6 transition group-hover:scale-110" />
				</button>
			</ActionToolTip>
		);
	}

	return (
		<ActionToolTip side="bottom" label="Step-by-Step UI Tour">
			<button
				onClick={() => openGuide(0)}
				className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:text-[#5865F2] dark:hover:text-[#5865F2] transition text-xs font-semibold ${className}`}
				aria-label="Step-by-Step UI Tour"
			>
				<Compass className="w-4 h-4 text-[#5865F2]" />
				<span className="hidden md:inline">UI Tour</span>
			</button>
		</ActionToolTip>
	);
};

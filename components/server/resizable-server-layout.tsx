"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface ResizableServerLayoutProps {
	sidebar: React.ReactNode;
	children: React.ReactNode;
}

const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 190;
const MAX_WIDTH = 420;
const NAV_WIDTH = 72; // Left server icon strip width

export const ResizableServerLayout = ({
	sidebar,
	children,
}: ResizableServerLayoutProps) => {
	const [width, setWidth] = useState<number>(DEFAULT_WIDTH);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const isMounted = useRef(false);

	// Load saved width from localStorage on mount
	useEffect(() => {
		isMounted.current = true;
		try {
			const saved = localStorage.getItem("discord_server_sidebar_width");
			if (saved) {
				const parsed = parseInt(saved, 10);
				if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
					setWidth(parsed);
				}
			}
		} catch {
			// Ignore localStorage errors
		}
	}, []);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const handleDoubleClick = useCallback(() => {
		setWidth(DEFAULT_WIDTH);
		try {
			localStorage.setItem(
				"discord_server_sidebar_width",
				DEFAULT_WIDTH.toString()
			);
		} catch {
			// Ignore
		}
	}, []);

	useEffect(() => {
		if (!isResizing) return;

		const handleMouseMove = (e: MouseEvent) => {
			// Calculate new width relative to the left navigation bar (72px)
			const newWidth = Math.min(
				MAX_WIDTH,
				Math.max(MIN_WIDTH, e.clientX - NAV_WIDTH)
			);
			setWidth(newWidth);
		};

		const handleMouseUp = () => {
			setIsResizing(false);
			try {
				localStorage.setItem("discord_server_sidebar_width", width.toString());
			} catch {
				// Ignore
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [isResizing, width]);

	return (
		<div
			style={{ ["--sidebar-width" as any]: `${width}px` }}
			className="workspace-stage h-full relative overflow-hidden"
		>
			{/* Resizable Server Sidebar (Desktop) */}
			<aside
				style={{ width: `${width}px` }}
				className={`channel-shell hidden md:flex h-[calc(100%-24px)] z-20 flex-col fixed top-3 bottom-3 left-[72px] transition-[width] overflow-hidden rounded-xl border border-border/80 ${
					isResizing ? "duration-0" : "duration-75 ease-out"
				}`}
				aria-label="Server Channels and Navigation"
			>
				{sidebar}

				{/* Discord-style Resize Drag Handle */}
				<div
					data-tour="resize-handle"
					onMouseDown={handleMouseDown}
					onDoubleClick={handleDoubleClick}
					title="Drag to resize sidebar · Double-click to reset"
					className={`absolute top-0 right-0 w-2 h-full cursor-col-resize z-30 transition-colors flex items-center justify-center group ${
						isResizing
							? "bg-primary"
							: "hover:bg-primary/60 active:bg-primary"
					}`}
				>
					<div
						className={`w-[2px] h-8 rounded-full transition-opacity ${
							isResizing
								? "bg-white opacity-100"
								: "bg-zinc-400 dark:bg-zinc-600 opacity-0 group-hover:opacity-100"
						}`}
					/>
				</div>
			</aside>

			{/* Main Content Area */}
			<main
				className={`workspace-main h-full md:pl-[var(--sidebar-width)] transition-[padding] ${
					isResizing ? "duration-0" : "duration-75 ease-out"
				}`}
			>
				{children}
			</main>
		</div>
	);
};

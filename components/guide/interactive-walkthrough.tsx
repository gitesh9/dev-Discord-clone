"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuickGuide } from "@/hooks/use-quick-guide";
import {
	ChevronLeft,
	ChevronRight,
	Check,
	X,
	Sparkles,
	HelpCircle,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
	targetSelector: string;
	title: string;
	instruction: string;
	preferredPosition: "right" | "left" | "top" | "bottom";
	badge: string;
}

const TOUR_STEPS: TourStep[] = [
	{
		targetSelector: '[data-tour="server-header"]',
		title: "Server Controls & Settings",
		instruction:
			"Click this header to open the server menu where you can manage roles, edit server appearance, create channels, and copy invite links.",
		preferredPosition: "right",
		badge: "Step 1 of 5",
	},
	{
		targetSelector: '[data-tour="channels-list"]',
		title: "Text & Voice Channels",
		instruction:
			"Switch seamlessly between real-time text channels (#general) and LiveKit WebRTC audio & video rooms (#video) with screen share.",
		preferredPosition: "right",
		badge: "Step 2 of 5",
	},
	{
		targetSelector: '[data-tour="resize-handle"]',
		title: "Resizable Discord Sidebar",
		instruction:
			"Drag this right border handle to dynamically resize your channel sidebar width, or double-click to snap back to default 240px.",
		preferredPosition: "right",
		badge: "Step 3 of 5",
	},
	{
		targetSelector: '[data-tour="chat-input"]',
		title: "Real-Time Chat & File Uploads",
		instruction:
			"Type instant messages synced across tabs via Socket.io. Use the (+) button to upload image/PDF attachments and add custom emojis.",
		preferredPosition: "top",
		badge: "Step 4 of 5",
	},
	{
		targetSelector: '[data-tour="user-footer"]',
		title: "User Profile & Voice Controls",
		instruction:
			"Toggle your microphone and deafen audio, switch between Test Admin and Test Participant, or restart this guided tour anytime.",
		preferredPosition: "top",
		badge: "Step 5 of 5",
	},
];

export const InteractiveWalkthrough = () => {
	const { isOpen, currentStep, nextStep, prevStep, closeGuide, setStep } =
		useQuickGuide();

	const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
	const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
	const [arrowClass, setArrowClass] = useState<string>("");
	const [isMounted, setIsMounted] = useState(false);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	const stepData = TOUR_STEPS[currentStep] || TOUR_STEPS[0];
	const isLastStep = currentStep === TOUR_STEPS.length - 1;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Calculate target position and floating tooltip coordinates
	const updatePosition = useCallback(() => {
		if (!isOpen) return;

		const targetEl = document.querySelector(stepData.targetSelector);
		if (!targetEl) {
			// Fallback: If element not found, position at bottom center
			setTargetRect(null);
			setTooltipStyle({
				position: "fixed",
				bottom: "24px",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 9999,
			});
			setArrowClass("");
			return;
		}

		const rect = targetEl.getBoundingClientRect();
		setTargetRect(rect);

		const tooltipWidth = 320;
		const tooltipHeight = 180;
		const spacing = 14;

		let top = 0;
		let left = 0;
		let arrow = "";

		const pos = stepData.preferredPosition;

		if (pos === "right") {
			left = rect.right + spacing;
			top = Math.max(16, rect.top + rect.height / 2 - 80);
			arrow = "left-arrow";

			// Clamp to viewport if overflows right
			if (left + tooltipWidth > window.innerWidth - 16) {
				left = Math.max(16, rect.left - tooltipWidth - spacing);
				arrow = "right-arrow";
			}
		} else if (pos === "left") {
			left = rect.left - tooltipWidth - spacing;
			top = Math.max(16, rect.top + rect.height / 2 - 80);
			arrow = "right-arrow";
		} else if (pos === "top") {
			top = rect.top - tooltipHeight - spacing;
			left = Math.max(16, rect.left + rect.width / 2 - tooltipWidth / 2);
			arrow = "bottom-arrow";

			// Clamp horizontally
			if (left + tooltipWidth > window.innerWidth - 16) {
				left = window.innerWidth - tooltipWidth - 16;
			}
			if (top < 16) {
				top = rect.bottom + spacing;
				arrow = "top-arrow";
			}
		} else {
			// bottom
			top = rect.bottom + spacing;
			left = Math.max(16, rect.left + rect.width / 2 - tooltipWidth / 2);
			arrow = "top-arrow";
		}

		setTooltipStyle({
			position: "fixed",
			top: `${top}px`,
			left: `${left}px`,
			width: `${tooltipWidth}px`,
			zIndex: 9999,
		});
		setArrowClass(arrow);
	}, [isOpen, stepData]);

	useEffect(() => {
		if (!isOpen) return;

		updatePosition();
		const handleScroll = () => updatePosition();
		const handleResize = () => updatePosition();

		window.addEventListener("scroll", handleScroll, true);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("scroll", handleScroll, true);
			window.removeEventListener("resize", handleResize);
		};
	}, [isOpen, updatePosition, currentStep]);

	if (!isMounted || !isOpen) return null;

	return (
		<>
			{/* High-visibility Target Element Halo Spotlight */}
			{targetRect && (
				<div
					style={{
						position: "fixed",
						top: `${targetRect.top - 4}px`,
						left: `${targetRect.left - 4}px`,
						width: `${targetRect.width + 8}px`,
						height: `${targetRect.height + 8}px`,
						pointerEvents: "none",
						zIndex: 9998,
					}}
					className="ring-2 ring-[#5865F2] ring-offset-2 ring-offset-[#313338] rounded-lg transition-all duration-300"
				/>
			)}

			{/* Guided Tooltip Pop-up Bubble */}
			<div
				style={tooltipStyle}
				className="bg-[#1E1F22] text-white p-4 rounded-xl border border-zinc-700/90 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200"
				role="dialog"
				aria-label="Interactive Tour Step"
			>
				{/* Top Step Counter & Close Button */}
				<div className="flex items-center justify-between pb-1 border-b border-zinc-800">
					<div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
						<Sparkles className="w-3.5 h-3.5 text-amber-400" />
						<span>{stepData.badge}</span>
					</div>
					<button
						onClick={closeGuide}
						className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition"
						aria-label="Close tour"
					>
						<X className="w-3.5 h-3.5" />
					</button>
				</div>

				{/* Title and Short Instruction */}
				<div className="space-y-1">
					<h3 className="text-sm font-semibold text-white tracking-tight">
						{stepData.title}
					</h3>
					<p className="text-xs text-zinc-300 leading-relaxed">
						{stepData.instruction}
					</p>
				</div>

				{/* Progress dots & Actions */}
				<div className="pt-1 flex items-center justify-between">
					{/* Progress Dots */}
					<div className="flex items-center gap-1">
						{TOUR_STEPS.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setStep(idx)}
								className={`h-1.5 rounded-full transition-all ${
									idx === currentStep
										? "w-4 bg-[#5865F2]"
										: "w-1.5 bg-zinc-700 hover:bg-zinc-600"
								}`}
								aria-label={`Go to step ${idx + 1}`}
							/>
						))}
					</div>

					{/* Navigation Buttons */}
					<div className="flex items-center gap-1.5">
						{currentStep > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={prevStep}
								className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
							>
								Back
							</Button>
						)}

						<Button
							size="sm"
							onClick={isLastStep ? closeGuide : nextStep}
							className="h-7 px-3 text-xs bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium shadow-sm transition flex items-center gap-1"
						>
							<span>{isLastStep ? "Got it!" : "Next"}</span>
							{isLastStep ? (
								<Check className="w-3 h-3" />
							) : (
								<ChevronRight className="w-3 h-3" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

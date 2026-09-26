"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useQuickGuide } from "@/hooks/use-quick-guide";
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Compass,
	Hash,
	Headphones,
	HelpCircle,
	Layers,
	MessageSquare,
	Mic,
	Server,
	ShieldCheck,
	Sparkles,
	Video,
	X,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GuideStep {
	title: string;
	subtitle: string;
	badge: string;
	icon: any;
	description: string;
	bullets: { title: string; desc: string; icon: any }[];
	actionHint: string;
}

const GUIDE_STEPS: GuideStep[] = [
	{
		title: "Multi-Server Architecture & Invites",
		subtitle: "Isolated communities with role-based member permissions",
		badge: "Step 1 of 5 · Server Infrastructure",
		icon: Server,
		description:
			"The leftmost dock hosts your Discord servers. Users can switch between workspaces, create new servers with custom avatars via UploadThing, and generate instant cryptographic invite codes.",
		bullets: [
			{
				icon: Server,
				title: "Dedicated Server Clusters",
				desc: "Every server manages its own channels, members, permissions, and invite codes.",
			},
			{
				icon: ShieldCheck,
				title: "Role-Based Access Control (RBAC)",
				desc: "Granular ADMIN, MODERATOR, and GUEST roles controlling channel management and moderation.",
			},
			{
				icon: Zap,
				title: "Instant Invite Links",
				desc: "Generate and copy unique invite URLs (/invite/{code}) with 1-click regeneration.",
			},
		],
		actionHint: "💡 Tip: Click the '+' icon in the leftmost dock to create a new server anytime.",
	},
	{
		title: "Real-Time WebSocket Messaging",
		subtitle: "Bidirectional chat with infinite scroll and file uploads",
		badge: "Step 2 of 5 · Chat Engine",
		icon: MessageSquare,
		description:
			"Powered by Socket.io and Next.js Pages API WebSocket server. Messages update in real-time across all connected clients with instantaneous delivery.",
		bullets: [
			{
				icon: Zap,
				title: "Bidirectional WebSockets",
				desc: "Zero-latency message broadcasts and live status indicator in the top header.",
			},
			{
				icon: Hash,
				title: "Infinite Scroll & Caching",
				desc: "Cursor-based pagination powered by TanStack React Query for smooth browsing of message histories.",
			},
			{
				icon: Sparkles,
				title: "In-Place Edits, Deletions & Files",
				desc: "Edit messages in real time (Enter to save, Esc to cancel), delete messages, attach images/PDFs, and pick emojis.",
			},
		],
		actionHint: "💡 Tip: Type a message in #general and see it persist and broadcast instantly.",
	},
	{
		title: "WebRTC Voice & Video Rooms",
		subtitle: "Enterprise-grade low-latency audio & video conferencing",
		badge: "Step 3 of 5 · Media Rooms",
		icon: Video,
		description:
			"Integrated with LiveKit WebRTC cloud infrastructure. Switch between text discussion, voice lounge, or full high-definition video conferencing with screen sharing.",
		bullets: [
			{
				icon: Mic,
				title: "Audio Rooms (#ChitChat)",
				desc: "Join a persistent voice lounge for frictionless team audio discussions.",
			},
			{
				icon: Video,
				title: "Video Rooms (#Lets Connect)",
				desc: "Multi-participant video grid with dynamic participant tiles and audio levels.",
			},
			{
				icon: Headphones,
				title: "Device & Screen Sharing Controls",
				desc: "Hardware mic toggle, camera switch, and full desktop or window screen sharing.",
			},
		],
		actionHint: "💡 Tip: Click 'ChitChat' or 'Lets Connect' in the channel list to test the LiveKit media room.",
	},
	{
		title: "1:1 Direct Messages & Quick Switcher",
		subtitle: "Private conversations and keyboard-first navigation",
		badge: "Step 4 of 5 · Direct Messaging & Navigation",
		icon: ShieldCheck,
		description:
			"Initiate private direct messaging with any community member, start 1:1 video calls, and quickly jump to any channel using the command palette.",
		bullets: [
			{
				icon: MessageSquare,
				title: "Private 1:1 Conversations",
				desc: "Click any member in the right member list to start an isolated, encrypted conversation.",
			},
			{
				icon: Video,
				title: "1:1 Video Calls",
				desc: "Start a private video call directly from the conversation header.",
			},
			{
				icon: Compass,
				title: "Command Palette (Ctrl + K / ⌘K)",
				desc: "Quickly fuzzy-search and jump between channels, voice rooms, and members without using the mouse.",
			},
		],
		actionHint: "💡 Tip: Press Ctrl+K (or ⌘K on Mac) to open the Quick Switcher command palette.",
	},
	{
		title: "Recruiter Portfolio Summary & Checklist",
		subtitle: "Production architecture overview and interactive evaluation guide",
		badge: "Step 5 of 5 · Tech Stack & Evaluation",
		icon: Layers,
		description:
			"Built as a full-featured, production-grade communication system demonstrating modern full-stack web engineering best practices.",
		bullets: [
			{
				icon: Layers,
				title: "Full-Stack Tech Stack",
				desc: "Next.js 14 App Router · TypeScript · PostgreSQL via Prisma ORM · Socket.io · LiveKit WebRTC · Clerk Auth · Tailwind CSS.",
			},
			{
				icon: ShieldCheck,
				title: "Recruiter Demo Mode Active",
				desc: "You are currently signed in with full Admin privileges on 'Gtex Server' with preloaded test data and channels.",
			},
			{
				icon: HelpCircle,
				title: "Reopen Anytime",
				desc: "Access this guide anytime via the '?' button in the top navigation header or user settings footer.",
			},
		],
		actionHint: "💡 Tip: Check off the interactive test actions below to explore every facet of the application.",
	},
];

const CHECKLIST_ITEMS = [
	{ id: "send-message", label: "Send a message with text or emoji in #general", hint: "Tests Socket.io real-time broadcast and DB persistence" },
	{ id: "edit-message", label: "Hover over your message and click edit / delete", hint: "Tests in-place real-time message mutations" },
	{ id: "quick-search", label: "Press Ctrl+K (or ⌘K) to open Quick Switcher", hint: "Tests cmdk fuzzy search across channels and members" },
	{ id: "join-voice", label: "Click 'ChitChat' to enter the WebRTC voice room", hint: "Tests LiveKit audio token generation and room connection" },
	{ id: "direct-message", label: "Click 'Gtex Zucks' in the members list for 1:1 DM", hint: "Tests 1:1 conversation initialization and private chat" },
	{ id: "server-settings", label: "Click server header dropdown to view Invite Code", hint: "Tests RBAC admin permissions and invite code modal" },
	{ id: "toggle-theme", label: "Toggle Dark / Light mode in the bottom-left dock", hint: "Tests next-themes hydration and responsive styling" },
];

export const QuickGuideModal = () => {
	const {
		isOpen,
		currentStep,
		activeTab,
		dontShowAgain,
		completedTasks,
		closeGuide,
		nextStep,
		prevStep,
		setStep,
		setActiveTab,
		toggleTask,
		setDontShowAgain,
	} = useQuickGuide();

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	const step = GUIDE_STEPS[currentStep] || GUIDE_STEPS[0];
	const IconComponent = step.icon;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && closeGuide()}>
			<DialogContent className="bg-[#313338] text-white p-0 overflow-hidden max-w-2xl border-zinc-700/60 shadow-2xl">
				{/* Top Header */}
				<div className="bg-[#2B2D31] px-6 py-4 border-b border-zinc-700/50 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="h-9 w-9 rounded-lg bg-[#5865F2] flex items-center justify-center text-white shadow-md">
							<Sparkles className="w-5 h-5" />
						</div>
						<div>
							<DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
								Recruiter Feature Guide & Architecture Tour
							</DialogTitle>
							<DialogDescription className="text-xs text-zinc-400">
								Discord Clone · Full-Stack Interactive Portfolio Demo
							</DialogDescription>
						</div>
					</div>
					<div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/60">
						<button
							onClick={() => setActiveTab("tour")}
							className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
								activeTab === "tour"
									? "bg-[#5865F2] text-white shadow-sm"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							Guided Tour
						</button>
						<button
							onClick={() => setActiveTab("checklist")}
							className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
								activeTab === "checklist"
									? "bg-[#5865F2] text-white shadow-sm"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							Demo Checklist
							<span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
								{Object.values(completedTasks).filter(Boolean).length}/
								{CHECKLIST_ITEMS.length}
							</span>
						</button>
					</div>
				</div>

				{/* Body Content */}
				{activeTab === "tour" ? (
					<div className="p-6 space-y-4">
						{/* Step indicator pill */}
						<div className="flex items-center justify-between">
							<Badge
								variant="outline"
								className="bg-[#5865F2]/10 text-[#5865F2] dark:text-indigo-400 border-indigo-500/30 font-medium text-xs px-2.5 py-1"
							>
								{step.badge}
							</Badge>
							<div className="flex items-center gap-1.5">
								{GUIDE_STEPS.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setStep(idx)}
										className={`h-2 rounded-full transition-all ${
											idx === currentStep
												? "w-6 bg-[#5865F2]"
												: "w-2 bg-zinc-600 hover:bg-zinc-500"
										}`}
										aria-label={`Go to step ${idx + 1}`}
									/>
								))}
							</div>
						</div>

						{/* Step Headline */}
						<div>
							<h3 className="text-xl font-bold text-white flex items-center gap-2">
								<IconComponent className="w-6 h-6 text-[#5865F2]" />
								{step.title}
							</h3>
							<p className="text-sm text-zinc-300 mt-1">{step.description}</p>
						</div>

						{/* Step Bullets */}
						<div className="grid grid-cols-1 gap-2.5 pt-1">
							{step.bullets.map((b, i) => {
								const BulletIcon = b.icon;
								return (
									<div
										key={i}
										className="flex items-start gap-3 p-2.5 rounded-lg bg-[#2B2D31]/80 border border-zinc-700/40 hover:border-zinc-600/70 transition"
									>
										<div className="p-1.5 rounded-md bg-[#1E1F22] text-[#5865F2] mt-0.5">
											<BulletIcon className="w-4 h-4" />
										</div>
										<div>
											<p className="text-xs font-semibold text-white">
												{b.title}
											</p>
											<p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
												{b.desc}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{/* Action Hint Box */}
						<div className="p-3 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between">
							<span>{step.actionHint}</span>
						</div>
					</div>
				) : (
					/* Checklist Tab for Recruiters */
					<div className="p-6 space-y-4">
						<div>
							<h3 className="text-base font-bold text-white flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-emerald-400" />
								Interactive Recruiter Feature Checklist
							</h3>
							<p className="text-xs text-zinc-400 mt-1">
								Use this checklist to systematically verify every technical requirement of the Discord clone.
							</p>
						</div>

						<div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
							{CHECKLIST_ITEMS.map((item) => {
								const isCompleted = !!completedTasks[item.id];
								return (
									<div
										key={item.id}
										onClick={() => toggleTask(item.id)}
										className={`p-2.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
											isCompleted
												? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
												: "bg-[#2B2D31]/80 border-zinc-700/40 text-zinc-300 hover:border-zinc-600"
										}`}
									>
										<input
											type="checkbox"
											checked={isCompleted}
											onChange={() => toggleTask(item.id)}
											className="mt-1 h-4 w-4 rounded border-zinc-600 text-[#5865F2] focus:ring-0 cursor-pointer accent-[#5865F2]"
										/>
										<div className="flex-1">
											<p
												className={`text-xs font-medium ${
													isCompleted ? "line-through text-zinc-400" : "text-white"
												}`}
											>
												{item.label}
											</p>
											<p className="text-[11px] text-zinc-400 mt-0.5">
												{item.hint}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Footer Controls */}
				<div className="bg-[#2B2D31] px-6 py-3.5 border-t border-zinc-700/50 flex items-center justify-between">
					<label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
						<input
							type="checkbox"
							checked={dontShowAgain}
							onChange={(e) => setDontShowAgain(e.target.checked)}
							className="rounded border-zinc-600 text-[#5865F2] focus:ring-0 accent-[#5865F2]"
						/>
						<span>Don&apos;t auto-show on startup</span>
					</label>

					<div className="flex items-center gap-2">
						{activeTab === "tour" ? (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={prevStep}
									disabled={currentStep === 0}
									className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/50"
								>
									<ChevronLeft className="w-4 h-4 mr-1" />
									Previous
								</Button>

								{currentStep < GUIDE_STEPS.length - 1 ? (
									<Button
										size="sm"
										onClick={nextStep}
										className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold"
									>
										Next
										<ChevronRight className="w-4 h-4 ml-1" />
									</Button>
								) : (
									<Button
										size="sm"
										onClick={() => {
											setActiveTab("checklist");
										}}
										className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
									>
										View Checklist
										<CheckCircle2 className="w-4 h-4 ml-1" />
									</Button>
								)}
							</>
						) : (
							<Button
								size="sm"
								onClick={closeGuide}
								className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold"
							>
								Start Exploring
								<CheckCircle2 className="w-4 h-4 ml-1" />
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

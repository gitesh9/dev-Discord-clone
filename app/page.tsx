import Link from "next/link";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { GuestSignInButton } from "@/components/auth/guest-sign-in-button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import {
	ArrowRight,
	Compass,
	Hash,
	Layers,
	MessageSquare,
	Mic,
	Radio,
	ShieldAlert,
	ShieldCheck,
	Terminal,
	Users,
	Video,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
	const profile = await currentProfile();

	let existingServer = null;
	if (profile) {
		existingServer = await db.server.findFirst({
			where: {
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
		});
	}

	if (!existingServer) {
		existingServer = await db.server.findFirst({
			orderBy: {
				createdAt: "asc",
			},
		});
	}

	return (
		<div className="landing-page min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground antialiased">
			{/* Top Navigation Bar */}
			<header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0F1012]/90 border-b border-zinc-800/80">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					{/* Brand Identity */}
					<Link
						href="/"
						className="flex items-center gap-3 group transition"
						aria-label="Discord Pro Home"
					>
						<div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
							<svg
								className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
								viewBox="0 0 127.14 96.36"
								aria-hidden="true"
							>
								<path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
							</svg>
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-base sm:text-lg tracking-tight text-white leading-none">
								Vertex <span className="text-[#5865F2]">Workspace</span>
							</span>
							<span className="text-[11px] text-zinc-400 mt-1 hidden xs:inline">
								Real-Time Architecture Showcase
							</span>
						</div>
					</Link>

					{/* Navigation Links (Desktop) */}
					<nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
						<a
							href="#features"
							className="hover:text-white transition-colors"
						>
							Capabilities
						</a>
						<a
							href="#architecture"
							className="hover:text-white transition-colors"
						>
							Architecture
						</a>
						<a
							href="#live-demo"
							className="hover:text-white transition-colors"
						>
							Live Demo
						</a>
					</nav>

					{/* Action Buttons */}
					<div className="flex items-center gap-2 sm:gap-3">
						<Link
							href="/sign-in"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/80 transition"
						>
							<span>Sign In</span>
						</Link>
						<Link
							href="/sign-up"
							className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/80 transition"
						>
							<span>Sign Up</span>
						</Link>
						{existingServer ? (
							<Link
								href={`/servers/${existingServer.id}`}
								className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-md transition"
							>
								<span>Open App</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</Link>
						) : (
							<Link
								href="/sign-in"
								className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-md transition"
							>
								<span>Get Started</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</Link>
						)}
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="landing-hero relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					{/* Editorial Metadata (Zero Pill Discipline) */}
					<div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-300 mb-6 font-mono uppercase tracking-wider">
						<span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_currentColor]" />System online</span>
						<span aria-hidden="true">·</span>
						<span>Next.js App Router</span>
						<span aria-hidden="true">·</span>
						<span>Real-time command center</span>
					</div>

					{/* Headline */}
					<h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06] max-w-4xl mx-auto">
						Your team, synchronized in a{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] via-indigo-400 to-sky-400">
							real-time command center
						</span>
					</h1>

					{/* Subtitle */}
					<p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
						A production-grade communication workspace combining instant messaging, focused channels, role-aware collaboration, and live audio and video rooms.
					</p>

					<div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase text-zinc-400">
						<span><strong className="text-zinc-100">WebSocket</strong> messaging</span>
						<span><strong className="text-zinc-100">WebRTC</strong> rooms</span>
						<span><strong className="text-zinc-100">RBAC</strong> permissions</span>
					</div>

					{/* 1-Click Guest Sign-In Hero Card */}
					<div
						id="live-demo"
						className="mt-8 max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-[#18191C] border border-zinc-800 shadow-2xl text-left"
					>
						<div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
							<span className="text-xs font-semibold text-zinc-200">
								Recruiter & Evaluator Fast-Track
							</span>
							<span className="text-[11px] font-mono text-emerald-400">
								Instant Access
							</span>
						</div>

						<p className="text-xs text-zinc-400 mb-3.5 leading-relaxed">
							Authenticate immediately as <strong>Server Owner / Admin</strong> into pre-populated channels, audio lounges, and chat history.
						</p>

						<div className="space-y-2.5">
							{existingServer && (
								<Link
									href={`/servers/${existingServer.id}`}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 transition-all"
								>
									<span>Enter Discord Workspace (Gtex Server)</span>
									<ArrowRight className="w-4 h-4" />
								</Link>
							)}
							<GoogleSignInButton mode="sign-in" />
							<GuestSignInButton />
							<div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
								<Link
									href="/sign-up"
									className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
								>
									Create new profile
								</Link>
								<Link
									href="/sign-in"
									className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
								>
									Sign in with email
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Responsive UI Mockup Preview (Adaptive for Mobile & Desktop) */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="landing-command-preview rounded-xl sm:rounded-2xl border border-zinc-700/90 bg-[#1E1F22] shadow-2xl overflow-hidden">
					{/* Window Top Bar */}
					<div className="bg-[#2B2D31] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-zinc-800 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
							<div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
							<div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
							<span className="ml-2 sm:ml-3 font-medium text-zinc-300 truncate max-w-[200px] sm:max-w-none">
								Gtex Server — #general
							</span>
						</div>
						<div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
							<span>Socket.io Live</span>
						</div>
					</div>

					{/* Application Layout Mockup */}
					<div className="flex h-80 sm:h-96 bg-[#313338] text-xs">
						{/* Server Dock (Visible on desktop & tablets) */}
						<div className="hidden sm:flex w-16 bg-[#1E1F22] p-3 flex-col items-center gap-3 border-r border-zinc-800/60 shrink-0">
							<div className="w-10 h-10 rounded-2xl bg-[#5865F2] text-white flex items-center justify-center font-bold text-sm shadow">
								GS
							</div>
							<div className="w-6 h-0.5 bg-zinc-700/60 rounded" />
							<div className="w-10 h-10 rounded-3xl bg-zinc-800 text-zinc-400 flex items-center justify-center font-medium">
								+
							</div>
						</div>

						{/* Channel Sidebar (Hidden on small mobile, visible from md up) */}
						<div className="hidden md:flex w-56 bg-[#2B2D31] p-3 flex-col border-r border-zinc-800/60 shrink-0">
							<div className="font-bold text-sm text-white pb-2.5 border-b border-zinc-700/50 flex items-center justify-between">
								<span>Gtex Server</span>
								<ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
							</div>

							<div className="mt-2.5 space-y-1 flex-1">
								<div className="text-[10px] uppercase font-bold text-zinc-400 px-1 py-1 font-mono">
									Text Channels
								</div>
								<div className="flex items-center gap-2 px-2 py-1.5 rounded bg-zinc-700/60 text-white font-medium">
									<Hash className="w-3.5 h-3.5 text-zinc-300" />
									<span>general</span>
								</div>

								<div className="text-[10px] uppercase font-bold text-zinc-400 px-1 pt-2 pb-1 font-mono">
									Voice Lounges
								</div>
								<div className="flex items-center gap-2 px-2 py-1.5 rounded text-zinc-300">
									<Mic className="w-3.5 h-3.5 text-emerald-400" />
									<span>ChitChat</span>
								</div>
								<div className="flex items-center gap-2 px-2 py-1.5 rounded text-zinc-300">
									<Video className="w-3.5 h-3.5 text-indigo-400" />
									<span>Lets Connect</span>
								</div>
							</div>

							<div className="pt-2 border-t border-zinc-700/50 flex items-center gap-2">
								<div className="w-7 h-7 rounded-full bg-[#5865F2] flex items-center justify-center font-bold text-white text-[10px]">
									GW
								</div>
								<div className="truncate">
									<div className="text-[11px] font-semibold text-white">
										Gitesh Wankhede
									</div>
									<div className="text-[9px] text-zinc-400">
										Admin · Guest Demo
									</div>
								</div>
							</div>
						</div>

						{/* Main Chat Stream (Fully responsive across all screens) */}
						<div className="flex-1 flex flex-col bg-[#313338] p-3 sm:p-4">
							<div className="flex-1 flex flex-col justify-end space-y-3 pb-3">
								<div className="flex items-start gap-2.5 sm:gap-3">
									<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
										GZ
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-semibold text-white text-xs sm:text-sm">
												Gtex Zucks
											</span>
											<span className="text-[10px] text-zinc-400">
												2:40 PM
											</span>
										</div>
										<p className="text-zinc-200 text-xs sm:text-sm mt-0.5 leading-relaxed">
											Try switching channels, launching the ChitChat voice lounge, or testing 1:1 direct messages.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-2.5 sm:gap-3">
									<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5865F2] flex items-center justify-center font-bold text-white text-xs shrink-0">
										GW
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-semibold text-white text-xs sm:text-sm">
												Gitesh Wankhede
											</span>
											<span className="text-[9px] text-rose-400 font-semibold font-mono">
												ADMIN
											</span>
											<span className="text-[10px] text-zinc-400">
												Just now
											</span>
										</div>
										<p className="text-zinc-200 text-xs sm:text-sm mt-0.5 leading-relaxed">
											Bidirectional WebSocket synchronization is live across all open sessions.
										</p>
									</div>
								</div>
							</div>

							<div className="p-2.5 rounded-lg bg-[#383A40] flex items-center gap-2 text-zinc-400 text-xs">
								<span className="w-5 h-5 rounded-full bg-zinc-600 flex items-center justify-center text-white text-xs">
									+
								</span>
								<span className="truncate">
									Message #general...
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Capabilities */}
			<section
				id="features"
				className="py-16 bg-[#121316] border-t border-b border-zinc-800/80"
			>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold text-white">
							Core Engineering Capabilities
						</h2>
						<p className="text-xs sm:text-sm text-zinc-400 mt-2">
							Built with high-performance real-time communication patterns.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
						{/* Feature 1 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center">
								<Radio className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								Bidirectional WebSockets
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Messages, live edits, attachments, and deletions update instantly across all active clients with zero polling latency via Socket.io.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
								<Video className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								LiveKit WebRTC Media SFU
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Low-latency audio voice lounges and video conference channels with screen sharing, participant tracks, and camera controls.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
								<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								Role-Based Access (RBAC)
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Hierarchical server permissions: Admin, Moderator, and Guest roles with member management, kicking, and invite code regeneration.
							</p>
						</div>

						{/* Feature 4 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
								<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								1:1 Direct Conversations
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Isolated direct messaging channels between members with private message histories and dedicated 1:1 video calling.
							</p>
						</div>

						{/* Feature 5 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
								<Compass className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								Command Palette (⌘K)
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Keyboard-first fuzzy search across text channels, voice lounges, and server members with automatic OS shortcut detection.
							</p>
						</div>

						{/* Feature 6 */}
						<div className="landing-feature p-5 sm:p-6 rounded-lg bg-[#18191C] border border-zinc-800 space-y-2.5">
							<div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
								<Layers className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<h3 className="text-sm sm:text-base font-semibold text-white">
								Infinite Scroll & Media
							</h3>
							<p className="text-xs text-zinc-400 leading-relaxed">
								Cursor-based pagination for message histories and UploadThing cloud storage integration for PDF and image attachments.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Architecture & Engineering Details */}
			<section id="architecture" className="py-16">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="p-5 sm:p-8 rounded-2xl bg-[#16171A] border border-zinc-800 space-y-5">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
								<Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
							</div>
							<div>
								<h3 className="text-base sm:text-lg font-bold text-white">
									System Architecture & Tech Stack
								</h3>
								<p className="text-xs text-zinc-400">
									Modern full-stack TypeScript stack designed for maintainability and scalability.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
							<div className="p-3 rounded-lg bg-[#1E1F22] border border-zinc-800">
								<span className="text-zinc-500 block text-[10px] uppercase font-mono">
									Frontend
								</span>
								<span className="font-semibold text-white mt-1 block">
									Next.js 14
								</span>
								<span className="text-[11px] text-zinc-400">
									App Router & Tailwind
								</span>
							</div>

							<div className="p-3 rounded-lg bg-[#1E1F22] border border-zinc-800">
								<span className="text-zinc-500 block text-[10px] uppercase font-mono">
									Database
								</span>
								<span className="font-semibold text-white mt-1 block">
									PostgreSQL & Prisma
								</span>
								<span className="text-[11px] text-zinc-400">
									Relational schemas
								</span>
							</div>

							<div className="p-3 rounded-lg bg-[#1E1F22] border border-zinc-800">
								<span className="text-zinc-500 block text-[10px] uppercase font-mono">
									Real-Time
								</span>
								<span className="font-semibold text-white mt-1 block">
									Socket.io
								</span>
								<span className="text-[11px] text-zinc-400">
									WebSocket engine
								</span>
							</div>

							<div className="p-3 rounded-lg bg-[#1E1F22] border border-zinc-800">
								<span className="text-zinc-500 block text-[10px] uppercase font-mono">
									Media SFU
								</span>
								<span className="font-semibold text-white mt-1 block">
									LiveKit WebRTC
								</span>
								<span className="text-[11px] text-zinc-400">
									Audio & Video mesh
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-8 border-t border-zinc-800/80 bg-[#0F1012] text-xs text-zinc-500 text-center">
				<div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p>
						Discord Pro Full-Stack Portfolio Project · Built for recruiter and engineering evaluation.
					</p>
					<div className="flex items-center gap-4">
						<Link
							href="/sign-in"
							className="hover:text-zinc-300 transition-colors"
						>
							Sign In / Guest Access
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}

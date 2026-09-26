"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
	CheckCircle2,
	ChevronDown,
	Loader2,
	ShieldAlert,
	Sparkles,
	UserCheck,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const GuestSignInButton = () => {
	const { isLoaded, signIn, setActive } = useSignIn();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [selectedPersona, setSelectedPersona] = useState<"admin" | "member">("admin");
	const [showPersonas, setShowPersonas] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGuestSignIn = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Call our dedicated server-side guest authentication endpoint
			const res = await fetch("/api/auth/guest-sign-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ persona: selectedPersona }),
			});

			if (!res.ok) {
				throw new Error("Failed to authenticate guest session");
			}

			const data = await res.json();

			// Store guest flag in localStorage for UI hints
			if (typeof window !== "undefined") {
				try {
					localStorage.setItem("is_guest_account", "true");
					localStorage.setItem("guest_persona", selectedPersona);
					localStorage.setItem("guest_user_name", data.user?.name || "Guest");
				} catch {
					// ignore localStorage restrictions
				}
			}

			// If Clerk client is active and returned a single-use sign-in ticket, hydrate Clerk session
			if (isLoaded && signIn && data.token) {
				try {
					const signInAttempt = await signIn.create({
						strategy: "ticket",
						ticket: data.token,
					});

					if (
						signInAttempt.status === "complete" &&
						signInAttempt.createdSessionId
					) {
						await setActive({ session: signInAttempt.createdSessionId });
					}
				} catch (clerkErr) {
					console.warn(
						"[GUEST_CLIENT] Clerk ticket hydration fallback to cookie session:",
						clerkErr
					);
				}
			}

			// Perform in-frame navigation to load initial profile & channels
			const targetUrl = data.redirectUrl || "/";
			// Use window.location for full session propagation into Server Components
			if (typeof window !== "undefined") {
				window.location.href = targetUrl;
			} else {
				router.push(targetUrl);
				router.refresh();
			}
		} catch (err: any) {
			console.error("[GUEST_SIGN_IN_ERROR]", err);
			setError(err?.message || "Something went wrong during guest sign-in.");
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full space-y-3">
			{/* Primary Action Button */}
			<div className="relative group">
				<Button
					onClick={handleGuestSignIn}
					disabled={isLoading}
					className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3C45A5] text-white font-semibold text-sm rounded-md transition-all shadow-md flex items-center justify-center gap-2 relative overflow-hidden"
				>
					{isLoading ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin text-white" />
							<span>Entering Demo Environment...</span>
						</>
					) : (
						<>
							<Sparkles className="w-4 h-4 text-amber-300" />
							<span>Sign in as Guest</span>
							<span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/20 ml-1">
								1-Click Demo
							</span>
						</>
					)}
				</Button>
			</div>

			{/* Persona selector toggle for recruiters */}
			<div className="pt-1">
				<button
					type="button"
					onClick={() => setShowPersonas(!showPersonas)}
					className="text-xs text-zinc-400 hover:text-zinc-200 transition flex items-center justify-between w-full px-2 py-1 rounded bg-zinc-800/40 border border-zinc-700/40"
				>
					<span className="flex items-center gap-1.5 text-zinc-300">
						{selectedPersona === "admin" ? (
							<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
						) : (
							<Users className="w-3.5 h-3.5 text-indigo-400" />
						)}
						Demo Persona:{" "}
						<strong className="text-white">
							{selectedPersona === "admin"
								? "Test Admin (Admin Access)"
								: "Test Participant (General Access)"}
						</strong>
					</span>
					<ChevronDown
						className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
							showPersonas ? "rotate-180" : ""
						}`}
					/>
				</button>

				{showPersonas && (
					<div className="mt-2 p-2 rounded-md bg-zinc-800/90 border border-zinc-700/60 space-y-1.5 text-xs text-zinc-300 animate-in fade-in slide-in-from-top-1 duration-150">
						<div
							onClick={() => {
								setSelectedPersona("admin");
								setShowPersonas(false);
							}}
							className={`p-2 rounded cursor-pointer transition flex items-start gap-2.5 ${
								selectedPersona === "admin"
									? "bg-[#5865F2]/20 border border-[#5865F2]/50 text-white"
									: "hover:bg-zinc-700/50"
							}`}
						>
							<ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5" />
							<div>
								<p className="font-semibold text-white flex items-center gap-1.5">
									Test Admin · testAdmin@example.com
									{selectedPersona === "admin" && (
										<CheckCircle2 className="w-3.5 h-3.5 text-[#5865F2]" />
									)}
								</p>
								<p className="text-[11px] text-zinc-400 mt-0.5">
									Full administrator permissions: server ownership, channel creation/deletion, invite generation, member moderation, and video rooms.
								</p>
							</div>
						</div>

						<div
							onClick={() => {
								setSelectedPersona("member");
								setShowPersonas(false);
							}}
							className={`p-2 rounded cursor-pointer transition flex items-start gap-2.5 ${
								selectedPersona === "member"
									? "bg-[#5865F2]/20 border border-[#5865F2]/50 text-white"
									: "hover:bg-zinc-700/50"
							}`}
						>
							<Users className="w-4 h-4 text-indigo-400 mt-0.5" />
							<div>
								<p className="font-semibold text-white flex items-center gap-1.5">
									Test Participant · testParticipant@example.com
									{selectedPersona === "member" && (
										<CheckCircle2 className="w-3.5 h-3.5 text-[#5865F2]" />
									)}
								</p>
								<p className="text-[11px] text-zinc-400 mt-0.5">
									General participant access: text chat, audio & video channels, emojis, attachments, and 1:1 direct messaging.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{error && (
				<p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-800 text-center">
					{error}
				</p>
			)}
		</div>
	);
};

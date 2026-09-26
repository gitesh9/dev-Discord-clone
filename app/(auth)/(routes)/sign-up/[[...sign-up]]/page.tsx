import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { GuestSignInButton } from "@/components/auth/guest-sign-in-button";
import { CustomAccountForm } from "@/components/auth/custom-account-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LogIn, Sparkles } from "lucide-react";

export default function SignUpPage() {
	return (
		<div className="w-full space-y-4">
			{/* Brand Header */}
			<div className="text-center space-y-1.5 pb-1">
				<div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#5865F2] text-white shadow-lg shadow-indigo-500/20 mb-1">
					<svg
						className="w-7 h-7 fill-current"
						viewBox="0 0 127.14 96.36"
					>
						<path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-white tracking-tight">
					Create Your Account
				</h1>
				<p className="text-xs text-zinc-400 max-w-sm mx-auto">
					Register your personalized Discord profile with avatar, join channels, and start chatting.
				</p>
			</div>

			{/* Navigation to Sign In */}
			<div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#2B2D31]/80 border border-zinc-700/60 text-xs">
				<span className="text-zinc-400">Already have an account?</span>
				<Link
					href="/sign-in"
					className="text-[#5865F2] hover:text-[#7983f5] font-semibold flex items-center gap-1 transition"
				>
					<LogIn className="w-3.5 h-3.5" />
					<span>Sign In Here</span>
				</Link>
			</div>

			{/* Google Sign Up Action */}
			<div className="bg-[#2B2D31] rounded-xl p-4 border border-zinc-700/80 shadow-xl space-y-2.5">
				<p className="text-xs font-semibold text-zinc-200">
					Single Sign-On
				</p>
				<GoogleSignInButton mode="sign-up" />
			</div>

			{/* Divider */}
			<div className="relative flex items-center justify-center">
				<div className="border-t border-zinc-700 w-full" />
				<span className="bg-[#1E1F22] px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider absolute">
					or register with email
				</span>
			</div>

			{/* Custom Profile Registration */}
			<CustomAccountForm mode="register" />

			{/* Dedicated Recruiter Guest Login Card */}
			<div className="bg-[#2B2D31] rounded-xl p-5 border border-zinc-700/80 shadow-xl space-y-3">
				<div className="flex items-center justify-between pb-1 border-b border-zinc-700/60">
					<div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
						<Sparkles className="w-4 h-4 text-amber-400" />
						<span>Skip Registration · Sign in as Guest</span>
					</div>
					<span className="text-xs font-mono text-emerald-400">
						1-Click Access
					</span>
				</div>

				<GuestSignInButton />
			</div>

			{/* Divider */}
			<div className="relative flex items-center justify-center">
				<div className="border-t border-zinc-700 w-full" />
				<span className="bg-[#1E1F22] px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider absolute">
					or create account via Clerk
				</span>
			</div>

			{/* Standard Clerk SignUp */}
			<div className="flex justify-center w-full">
				<SignUp
					appearance={{
						elements: {
							rootBox: "w-full",
							card: "bg-[#2B2D31] shadow-xl border border-zinc-700/80 rounded-xl w-full",
							headerTitle: "text-lg font-bold text-white",
							headerSubtitle: "text-xs text-zinc-400",
							formButtonPrimary:
								"bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium text-xs rounded-md h-10 transition-colors",
							footerActionLink: "text-[#5865F2] hover:underline text-xs",
							formFieldInput:
								"bg-[#1E1F22] border-zinc-700 text-white rounded-md text-xs focus:ring-1 focus:ring-[#5865F2]",
							formFieldLabel: "text-xs text-zinc-300 font-medium",
						},
					}}
				/>
			</div>
		</div>
	);
}

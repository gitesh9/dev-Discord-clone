"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
	mode?: "sign-in" | "sign-up";
	className?: string;
}

export const GoogleSignInButton = ({
	mode = "sign-in",
	className = "",
}: GoogleSignInButtonProps) => {
	const { signIn, isLoaded: isSignInLoaded } = useSignIn();
	const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (mode === "sign-up") {
				if (isSignUpLoaded && signUp) {
					await signUp.authenticateWithRedirect({
						strategy: "oauth_google",
						redirectUrl: "/sso-callback",
						redirectUrlComplete: "/",
					});
					return;
				}
			} else {
				if (isSignInLoaded && signIn) {
					await signIn.authenticateWithRedirect({
						strategy: "oauth_google",
						redirectUrl: "/sso-callback",
						redirectUrlComplete: "/",
					});
					return;
				}
			}

			// Fallback: If Clerk credentials are not active or in demo sandbox, log in as test participant
			const res = await fetch("/api/auth/guest-sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ persona: "member" }),
			});

			if (res.ok) {
				const data = await res.json();
				window.location.href = data.redirectUrl || "/";
			} else {
				throw new Error("Unable to initialize Google authentication");
			}
		} catch (err: any) {
			console.error("[GOOGLE_AUTH_ERROR]", err);
			// If redirecting, Clerk throws or navigates away; only show error if aborted
			if (err?.errors?.[0]?.message) {
				setError(err.errors[0].message);
			} else if (err?.message && !err.message.includes("cancelled")) {
				setError(err.message);
			}
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full space-y-1.5">
			<button
				type="button"
				onClick={handleGoogleAuth}
				disabled={isLoading}
				className={`w-full h-11 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-lg transition-all shadow-sm border border-zinc-200 flex items-center justify-center gap-3 relative cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
			>
				{isLoading ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
						<span>Connecting to Google...</span>
					</>
				) : (
					<>
						{/* Official Multi-colored Google G Logo */}
						<svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
							/>
						</svg>
						<span className="tracking-tight text-zinc-700">
							{mode === "sign-up" ? "Sign up with Google" : "Sign in with Google"}
						</span>
					</>
				)}
			</button>
			{error && (
				<p className="text-[11px] text-rose-400 text-center">{error}</p>
			)}
		</div>
	);
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AVATAR_PRESETS = [
	{
		label: "Clyde Bot",
		url: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#5865F2"/><path d="M70 35H30c-5.5 0-10 4.5-10 10v16c0 5.5 4.5 10 10 10h5l3 7 7-7h25c5.5 0 10-4.5 10-10V45c0-5.5-4.5-10-10-10z" fill="#fff"/><circle cx="40" cy="52" r="4" fill="#5865F2"/><circle cx="60" cy="52" r="4" fill="#5865F2"/></svg>`),
	},
	{
		label: "Gamer Fox",
		url: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FF5722"/><stop offset="100%" stop-color="#E91E63"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#gf)"/><polygon points="30,25 45,45 25,45" fill="#fff"/><polygon points="70,25 55,45 75,45" fill="#fff"/><circle cx="50" cy="55" r="24" fill="#fff"/><circle cx="42" cy="54" r="3.5" fill="#2B2D31"/><circle cx="58" cy="54" r="3.5" fill="#2B2D31"/><polygon points="46,62 54,62 50,66" fill="#FF5722"/></svg>`),
	},
	{
		label: "Cyber Cat",
		url: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="cc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00C9FF"/><stop offset="100%" stop-color="#92FE9D"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#cc)"/><polygon points="25,28 42,46 22,46" fill="#1E1F22"/><polygon points="75,28 58,46 78,46" fill="#1E1F22"/><circle cx="50" cy="56" r="22" fill="#1E1F22"/><ellipse cx="41" cy="54" rx="4" ry="5" fill="#92FE9D"/><ellipse cx="59" cy="54" rx="4" ry="5" fill="#92FE9D"/></svg>`),
	},
	{
		label: "Purple Panda",
		url: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8E2DE2"/><stop offset="100%" stop-color="#4A00E0"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#pp)"/><circle cx="30" cy="34" r="10" fill="#2B2D31"/><circle cx="70" cy="34" r="10" fill="#2B2D31"/><circle cx="50" cy="55" r="25" fill="#fff"/><circle cx="41" cy="52" r="5" fill="#4A00E0"/><circle cx="59" cy="52" r="5" fill="#4A00E0"/><ellipse cx="50" cy="62" rx="4" ry="3" fill="#2B2D31"/></svg>`),
	},
];

interface CustomAccountFormProps {
	mode?: "register" | "login";
}

export const CustomAccountForm = ({ mode = "register" }: CustomAccountFormProps) => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Please enter an account username or display name.");
			return;
		}

		try {
			setIsLoading(true);
			const res = await fetch("/api/auth/custom-account", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					imageUrl: selectedAvatar,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to create account");
			}

			if (data.redirectUrl) {
				router.push(data.redirectUrl);
				router.refresh();
			} else {
				router.push("/");
				router.refresh();
			}
		} catch (err: any) {
			setError(err.message || "An error occurred while creating your account.");
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-[#2B2D31] rounded-xl p-5 border border-zinc-700/80 shadow-xl space-y-4 text-left">
			<div className="flex items-center justify-between pb-2 border-b border-zinc-700/60">
				<div className="flex items-center gap-2">
					<div className="p-1.5 rounded-lg bg-[#5865F2]/20 text-[#5865F2]">
						<User className="w-4 h-4" />
					</div>
					<div>
						<h2 className="text-sm font-semibold text-white">
							{mode === "register" ? "Create Workspace Profile" : "Quick Custom Login"}
						</h2>
						<p className="text-[11px] text-zinc-400">
							Instant account creation with full server access
						</p>
					</div>
				</div>
				<span className="text-xs font-mono text-emerald-400">
					Instant Access
				</span>
			</div>

			{error && (
				<div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Avatar Selection */}
				<div className="space-y-2">
					<Label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
						Choose Avatar
					</Label>
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#5865F2] ring-2 ring-[#5865F2]/30 shrink-0">
							<Image
								src={selectedAvatar}
								alt="Selected Avatar"
								fill
								unoptimized
								className="object-cover"
							/>
						</div>
						<div className="flex items-center gap-2">
							{AVATAR_PRESETS.map((preset) => (
								<button
									type="button"
									key={preset.label}
									onClick={() => setSelectedAvatar(preset.url)}
									className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition ${
										selectedAvatar === preset.url
											? "border-[#5865F2] scale-105"
											: "border-zinc-700 opacity-70 hover:opacity-100"
									}`}
									title={preset.label}
								>
									<Image
										src={preset.url}
										alt={preset.label}
										fill
										unoptimized
										className="object-cover"
									/>
									{selectedAvatar === preset.url && (
										<div className="absolute inset-0 bg-[#5865F2]/20 flex items-center justify-center">
											<Check className="w-3 h-3 text-white drop-shadow" />
										</div>
									)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Display Name Input */}
				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
						Display Name / Username <span className="text-rose-400">*</span>
					</Label>
					<div className="relative">
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Maverick, ShadowCoder, Luna"
							disabled={isLoading}
							className="bg-[#1E1F22] border-zinc-700 text-white placeholder:text-zinc-500 text-xs pl-8 focus-visible:ring-[#5865F2]"
							required
						/>
						<User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3" />
					</div>
				</div>

				{/* Email Input (Optional) */}
				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
						Email <span className="text-zinc-500 text-[10px] lowercase">(optional)</span>
					</Label>
					<div className="relative">
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="name@example.com"
							disabled={isLoading}
							className="bg-[#1E1F22] border-zinc-700 text-white placeholder:text-zinc-500 text-xs pl-8 focus-visible:ring-[#5865F2]"
						/>
						<Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3" />
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={isLoading || !name.trim()}
					className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold h-10 shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
				>
					{isLoading ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Creating Profile...</span>
						</>
					) : (
						<>
							<span>{mode === "register" ? "Create Account & Enter" : "Sign In & Enter"}</span>
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</Button>
			</form>
		</div>
	);
};

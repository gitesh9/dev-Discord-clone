import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Sora({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
	title: "Vertex — Real-time Team Workspace",
	description: "A polished real-time workspace with channels, direct messages, and voice and video rooms.",
	openGraph: {
		title: "Vertex — Real-time Team Workspace",
		description: "A polished real-time workspace with channels, direct messages, and voice and video rooms.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const clerkPublishableKey =
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
		"pk_test_Y2xlcmsuZXhhbXBsZS5jb20k";

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					bodyFont.variable,
					displayFont.variable,
					"app-body bg-background text-foreground antialiased"
				)}
			>
				<ClerkProvider
					publishableKey={clerkPublishableKey}
					proxyUrl="/api/clerk-proxy"
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
						storageKey="discord-theme"
					>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}

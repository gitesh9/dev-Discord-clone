import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import "@uploadthing/react/styles.css";

import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Discord Clone",
	description: "Full-stack Discord clone featuring servers, channels, direct messaging, and voice/video calling.",
	openGraph: {
		title: "Discord Clone",
		description: "Full-stack Discord clone featuring servers, channels, direct messaging, and voice/video calling.",
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
					inter.className,
					"bg-[#313338] text-zinc-100 antialiased"
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

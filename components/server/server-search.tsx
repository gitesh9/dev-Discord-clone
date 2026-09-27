"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ActionToolTip } from "@/components/action-tootltip";

interface ServerSearchProps {
	data:
		| {
				label: string;
				type: "channel" | "member";
				data:
					| {
							icon: React.ReactNode;
							name: string;
							id: string;
					  }[]
					| undefined;
		  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
	const [open, setOpen] = useState(false);
	const [isMac, setIsMac] = useState(false);
	const router = useRouter();
	const params = useParams();

	useEffect(() => {
		setIsMac(typeof window !== "undefined" && navigator.userAgent.toUpperCase().includes("MAC"));

		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const onClick = ({
		id,
		type,
	}: {
		id: string;
		type: "channel" | "member";
	}) => {
		setOpen(false);

		if (type === "member") {
			return router.push(
				`/servers/${params?.serverId}/conversations/${id}`
			);
		}
		if (type === "channel") {
			return router.push(`/servers/${params?.serverId}/channels/${id}`);
		}
	};

	return (
		<>
			<ActionToolTip label={`Quick Switcher (${isMac ? "⌘K" : "Ctrl+K"})`} side="top">
				<button
					onClick={() => setOpen(true)}
					className="search-switcher group px-2.5 py-2 rounded-lg flex items-center gap-x-2 w-full transition border border-white/[0.06] bg-black/10 hover:bg-white/5 hover:border-white/10"
				>
					<Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition" />
					<p className="font-medium text-[13px] text-muted-foreground group-hover:text-foreground transition">
						Search
					</p>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-muted-foreground ml-auto">
						<span>{isMac ? "⌘" : "ctrl+"}</span>K
					</kbd>
				</button>
			</ActionToolTip>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search all channels, voice lounges, and members..." />
				<CommandList>
					<CommandEmpty className="py-6 text-center text-sm text-zinc-500">
						No matching channels or members found.
					</CommandEmpty>
					{data.map(({ label, type, data: items }) => {
						if (!items?.length) {
							return null;
						}
						return (
							<CommandGroup key={label} heading={label}>
								{items?.map(({ id, icon, name }) => {
									return (
										<CommandItem
											onSelect={() =>
												onClick({ id, type })
											}
											key={id}
											className="flex items-center gap-x-2 cursor-pointer py-2 rounded-md"
										>
											{icon}
											<span className="text-sm font-medium">{name}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};

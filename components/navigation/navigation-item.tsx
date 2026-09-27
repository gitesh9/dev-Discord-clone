"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionToolTip } from "@/components/action-tootltip";

interface NavigationItemProps {
	id: string;
	imageUrl: string;
	name: string;
}
export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();

	const onClick = () => {
		router.push(`/servers/${id}`);
	};
	return (
		<ActionToolTip side="right" align="center" label={name}>
			<button
				onClick={onClick}
				className="group relative flex items-center"
			>
				<div
					className={cn(
						"server-active absolute left-0 bg-primary rounded-r-full transition-all w-[3px]",
						params?.serverId !== id && "group-hover:h-[20px]",
						params?.serverId === id ? "h-[36px]" : "h-[8px]"
					)}
				/>
				<div
					className={cn(
						"server-avatar relative group flex mx-3 h-[44px] w-[44px] rounded-xl transition-all overflow-hidden ring-1 ring-white/10",
						params?.serverId === id &&
							"bg-primary/10 text-primary ring-primary/60"
					)}
				>
					<Image fill src={imageUrl} alt={`${name} server`}></Image>
				</div>
			</button>
		</ActionToolTip>
	);
};

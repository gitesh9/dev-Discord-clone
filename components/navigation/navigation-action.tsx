"use client";

import { Plus } from "lucide-react";

import { ActionToolTip } from "@/components/action-tootltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
	const { onOpen } = useModal();

	return (
		<div>
			<ActionToolTip side="right" align="center" label="Add a server">
				<button
					className="group flex items-center"
					onClick={() => onOpen("createServer")}
				>
					<div className="server-add flex mx-3 h-[44px] w-[44px] rounded-xl transition-all overflow-hidden items-center justify-center bg-white/5 border border-white/10 group-hover:bg-primary/15 group-hover:border-primary/40">
						<Plus
							className="group-hover:text-white transition text-primary"
							size={25}
						></Plus>
					</div>
				</button>
			</ActionToolTip>
		</div>
	);
};

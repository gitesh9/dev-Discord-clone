"use client";

import { useEffect, useState } from "react";

import { EditServerModal } from "@/components/modals/edit-server-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";

export const ModalProvider = () => {
	const [isMounted, setIsMouned] = useState(false);

	useEffect(() => {
		setIsMouned(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
		</>
	);
};

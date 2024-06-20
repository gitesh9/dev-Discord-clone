"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";

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
		</>
	);
};

import { create } from "zustand";

export interface QuickGuideStore {
	isOpen: boolean;
	currentStep: number;
	activeTab: "tour" | "checklist";
	dontShowAgain: boolean;
	completedTasks: Record<string, boolean>;
	openGuide: (step?: number) => void;
	closeGuide: () => void;
	nextStep: () => void;
	prevStep: () => void;
	setStep: (step: number) => void;
	setActiveTab: (tab: "tour" | "checklist") => void;
	toggleTask: (taskId: string) => void;
	setDontShowAgain: (val: boolean) => void;
}

export const useQuickGuide = create<QuickGuideStore>((set) => ({
	isOpen: false,
	currentStep: 0,
	activeTab: "tour",
	dontShowAgain: false,
	completedTasks: {
		"explore-general": true,
	},
	openGuide: (step = 0) => set({ isOpen: true, currentStep: step }),
	closeGuide: () => set({ isOpen: false }),
	nextStep: () =>
		set((state) => ({
			currentStep: Math.min(state.currentStep + 1, 4),
		})),
	prevStep: () =>
		set((state) => ({
			currentStep: Math.max(state.currentStep - 1, 0),
		})),
	setStep: (step) => set({ currentStep: step }),
	setActiveTab: (activeTab) => set({ activeTab }),
	toggleTask: (taskId) =>
		set((state) => ({
			completedTasks: {
				...state.completedTasks,
				[taskId]: !state.completedTasks[taskId],
			},
		})),
	setDontShowAgain: (dontShowAgain) => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					"discord_clone_tour_dismissed",
					dontShowAgain ? "true" : "false"
				);
			} catch {
				// Ignore storage errors
			}
		}
		set({ dontShowAgain });
	},
}));

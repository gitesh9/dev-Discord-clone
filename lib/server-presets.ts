export interface ServerPreset {
	id: string;
	label: string;
	category: string;
	url: string;
	bgGradient: string;
}

export const SERVER_PRESET_ICONS: ServerPreset[] = [
	{
		id: "gaming",
		label: "Gaming",
		category: "Games & Esports",
		bgGradient: "from-indigo-600 to-purple-600",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5865F2"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g1)"/><path d="M30 46h40c5 0 8 5 6 12l-4 14c-1 3-4 5-7 5s-6-3-7-6l-2-7h-12l-2 7c-1 3-4 6-7 6s-6-2-7-5l-4-14c-2-7 1-12 6-12z" fill="#ffffff"/><circle cx="39" cy="56" r="3.5" fill="#5865F2"/><circle cx="62" cy="54" r="3" fill="#5865F2"/><circle cx="68" cy="59" r="3" fill="#5865F2"/></svg>`
			),
	},
	{
		id: "dev",
		label: "Dev Team",
		category: "Code & Engineering",
		bgGradient: "from-emerald-600 to-teal-700",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#0F766E"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g2)"/><path d="M38 36L24 50L38 64M62 36L76 50L62 64M54 32L46 68" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
			),
	},
	{
		id: "design",
		label: "Design",
		category: "Creative & Art",
		bgGradient: "from-amber-500 to-rose-500",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#F43F5E"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g3)"/><circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" stroke-width="5"/><circle cx="42" cy="42" r="4.5" fill="#ffffff"/><circle cx="58" cy="40" r="4.5" fill="#ffffff"/><circle cx="64" cy="53" r="4.5" fill="#ffffff"/><circle cx="43" cy="60" r="5" fill="#F59E0B" stroke="#ffffff" stroke-width="2.5"/></svg>`
			),
	},
	{
		id: "lounge",
		label: "Lounge",
		category: "Community & Chill",
		bgGradient: "from-sky-500 to-indigo-600",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0EA5E9"/><stop offset="100%" stop-color="#6366F1"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g4)"/><path d="M28 40h44v22a14 14 0 01-14 14H42a14 14 0 01-14-14V40z" fill="#ffffff"/><path d="M72 46h7a6 6 0 016 6v2a6 6 0 01-6 6h-7" stroke="#ffffff" stroke-width="4.5" fill="none"/><line x1="24" y1="80" x2="76" y2="80" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/></svg>`
			),
	},
	{
		id: "music",
		label: "Music",
		category: "Audio & Beats",
		bgGradient: "from-purple-600 to-pink-600",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9333EA"/><stop offset="100%" stop-color="#DB2777"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g5)"/><path d="M42 66a8 8 0 11-8-8c3 0 6 1 8 3V32l28-6v28a8 8 0 11-8-8c3 0 6 1 8 3V38l-20 4.5V66z" fill="#ffffff"/></svg>`
			),
	},
	{
		id: "study",
		label: "Study",
		category: "Education & Co-work",
		bgGradient: "from-blue-600 to-cyan-600",
		url:
			"data:image/svg+xml;utf8," +
			encodeURIComponent(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#06B6D4"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g6)"/><path d="M50 26L22 39l28 13 28-13L50 26zM30 50v14c0 7 9 11 20 11s20-4 20-11V50l-20 9-20-9z" fill="#ffffff"/></svg>`
			),
	},
];

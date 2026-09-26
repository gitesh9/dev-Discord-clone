import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white p-4">
			<h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
			<p className="text-zinc-400 mb-4 text-sm">
				The page or server channel you are looking for does not exist.
			</p>
			<Link
				href="/"
				className="px-4 py-2 rounded-md bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold transition"
			>
				Return Home
			</Link>
		</div>
	);
}

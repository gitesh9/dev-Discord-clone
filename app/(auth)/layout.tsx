const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-full w-full flex items-center justify-center bg-[#1E1F22] p-4 py-8 relative overflow-y-auto">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#1E1F22] to-[#1E1F22] pointer-events-none" />
			<div className="relative z-10 w-full max-w-md flex flex-col items-center my-auto">
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;

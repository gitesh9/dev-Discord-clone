const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="auth-stage min-h-full w-full flex items-center justify-center bg-background p-4 py-8 relative overflow-y-auto">
			<div className="absolute inset-0 pointer-events-none" />
			<div className="relative z-10 w-full max-w-md flex flex-col items-center my-auto">
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;

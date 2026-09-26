"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Settings } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SERVER_PRESET_ICONS } from "@/lib/server-presets";

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Server name is required",
	}),
	imageUrl: z.string().min(1, {
		message: "Server image is required",
	}),
});

export const EditServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "editServer";
	const { server } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	useEffect(() => {
		if (server) {
			form.setValue("name", server.name);
			form.setValue("imageUrl", server.imageUrl);
		}
	}, [server, form]);

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/servers/${server?.id}`, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-2xl">
				<DialogHeader className="pt-8 px-6">
					<div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-2">
						<Settings className="w-6 h-6 text-[#5865F2]" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Server Settings
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-400 text-xs mt-1">
						Update server details and avatar.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="space-y-6 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											{/* Quick preset icons */}
											<div className="mt-3">
												<span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1 mb-2">
													<Sparkles className="w-3 h-3 text-[#5865F2]" />
													Or pick a ready-to-use icon:
												</span>
												<div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
													{SERVER_PRESET_ICONS.map((preset) => (
														<button
															type="button"
															key={preset.id}
															onClick={() => field.onChange(preset.url)}
															className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition ${
																field.value === preset.url
																	? "border-[#5865F2] ring-2 ring-[#5865F2]/40 scale-105"
																	: "border-zinc-300 dark:border-zinc-700 opacity-80 hover:opacity-100"
															}`}
															title={`${preset.label} (${preset.category})`}
														>
															<Image
																src={preset.url}
																alt={preset.label}
																fill
																unoptimized
																className="object-cover"
																referrerPolicy="no-referrer"
															/>
														</button>
													))}
												</div>
											</div>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-zinc-300">
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-100 dark:bg-[#1E1F22] border-0 focus-visible:ring-2 focus-visible:ring-[#5865F2] text-zinc-800 dark:text-zinc-100 focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-zinc-100 dark:bg-[#2B2D31] px-6 py-4 flex items-center justify-between">
							<Button
								type="button"
								variant="ghost"
								onClick={handleClose}
								disabled={isLoading}
								className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
							>
								Cancel
							</Button>
							<Button variant="primary" disabled={isLoading}>
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

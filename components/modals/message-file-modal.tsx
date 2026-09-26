"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Paperclip, Sparkles, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const SAMPLE_ATTACHMENTS = [
	{
		label: "Architecture Diagram",
		url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
	},
	{
		label: "Design Mockup",
		url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
	},
];

const formSchema = z.object({
	fileUrl: z.string().min(1, {
		message: "Attachment is required",
	}),
});

export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "messageFile";
	const { apiUrl, query } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fileUrl: "",
		},
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			});

			await axios.post(url, { ...values, content: values.fileUrl });

			form.reset();
			router.refresh();
			handleClose();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-2xl">
				<DialogHeader className="pt-8 px-6">
					<div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-2">
						<Paperclip className="w-6 h-6 text-[#5865F2]" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Send an Attachment
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-400 text-xs mt-1">
						Upload an image or document, or select a sample demo attachment below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="space-y-6 px-6">
							<div className="flex flex-col items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem className="w-full flex flex-col items-center">
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>

											{/* Quick demo attachment presets */}
											<div className="mt-4 w-full">
												<div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
													<Sparkles className="w-3 h-3 text-[#5865F2]" />
													<span>Quick Demo Samples (1-click select):</span>
												</div>
												<div className="grid grid-cols-2 gap-2">
													{SAMPLE_ATTACHMENTS.map((item) => (
														<button
															type="button"
															key={item.label}
															onClick={() => field.onChange(item.url)}
															className={`flex items-center gap-2 p-2 rounded-lg border text-left transition ${
																field.value === item.url
																	? "border-[#5865F2] bg-[#5865F2]/10"
																	: "border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-[#2B2D31] hover:border-zinc-300 dark:hover:border-zinc-600"
															}`}
														>
															<div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
																<Image
																	src={item.url}
																	alt={item.label}
																	fill
																	className="object-cover"
																	referrerPolicy="no-referrer"
																/>
															</div>
															<div className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
																{item.label}
															</div>
														</button>
													))}
												</div>
											</div>
										</FormItem>
									)}
								/>
							</div>
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
							<Button
								variant="primary"
								disabled={isLoading || !form.watch("fileUrl")}
							>
								Send Attachment
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

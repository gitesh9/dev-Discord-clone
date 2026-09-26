"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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

export const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false);

	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: SERVER_PRESET_ICONS[0].url,
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post("/api/servers", values);

			form.reset();
			router.refresh();
			if (response.data?.id) {
				router.push(`/servers/${response.data.id}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Customize your server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Give your server some Personality
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="space-y-8 px-6">
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
												<span className="text-[11px] text-zinc-500 flex items-center justify-center gap-1 mb-2">
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
																	: "border-zinc-300 opacity-80 hover:opacity-100"
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
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											></Input>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading}>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

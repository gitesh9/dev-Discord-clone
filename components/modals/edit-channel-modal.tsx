"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video, Edit3 } from "lucide-react";

import {
	Dialog,
	DialogContent,
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
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Channel name is required",
		})
		.refine((name) => name.toLowerCase() !== "general", {
			message: "Channel name cannot be 'general'",
		}),
	type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "editChannel";
	const { channel, server } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: channel?.type || ChannelType.TEXT,
		},
	});

	useEffect(() => {
		if (channel) {
			form.setValue("name", channel.name);
			form.setValue("type", channel.type);
		}
	}, [channel, form]);

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id,
				},
			});
			await axios.patch(url, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white dark:bg-[#313338] text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-2xl">
				<DialogHeader className="pt-8 px-6">
					<div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-2">
						<Edit3 className="w-6 h-6 text-[#5865F2]" />
					</div>
					<DialogTitle className="text-2xl text-center font-bold">
						Edit Channel
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="space-y-6 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-zinc-300">
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-100 dark:bg-[#1E1F22] border-0 focus-visible:ring-2 focus-visible:ring-[#5865F2] text-zinc-800 dark:text-zinc-100 focus-visible:ring-offset-0"
												placeholder="Enter channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-zinc-300">
											Channel Type
										</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-zinc-100 dark:bg-[#1E1F22] border-0 focus:ring-2 focus:ring-[#5865F2] text-zinc-800 dark:text-zinc-100 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-white dark:bg-[#2B2D31] border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
												<SelectItem value={ChannelType.TEXT} className="cursor-pointer">
													<div className="flex items-center gap-2">
														<Hash className="w-4 h-4 text-zinc-500" />
														<span>Text · Socket.io Real-time</span>
													</div>
												</SelectItem>
												<SelectItem value={ChannelType.AUDIO} className="cursor-pointer">
													<div className="flex items-center gap-2">
														<Mic className="w-4 h-4 text-emerald-500" />
														<span>Audio · WebRTC Voice Lounge</span>
													</div>
												</SelectItem>
												<SelectItem value={ChannelType.VIDEO} className="cursor-pointer">
													<div className="flex items-center gap-2">
														<Video className="w-4 h-4 text-indigo-500" />
														<span>Video · WebRTC Screen Share</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
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

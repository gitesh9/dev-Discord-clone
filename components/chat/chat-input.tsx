"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CornerDownLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmojiPicker } from "@/components/emoji-picker";
import { useModal } from "@/hooks/use-modal-store";
import { ActionToolTip } from "@/components/action-tootltip";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: "conversation" | "channel";
}

const formSchema = z.object({
	content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
	const { onOpen } = useModal();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({ url: apiUrl, query });
			await axios.post(url, values);
			form.reset();
			router.refresh();
		} catch (error) {
			console.log(error);
		}
	};

	const sendPreset = async (text: string) => {
		try {
			const url = qs.stringifyUrl({ url: apiUrl, query });
			await axios.post(url, { content: text });
			router.refresh();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div data-tour="chat-input" className="relative px-4 pb-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="relative">
										<ActionToolTip label="Attach images, PDFs, or files (UploadThing)" side="top">
											<button
												type="button"
												onClick={() =>
													onOpen("messageFile", {
														apiUrl,
														query,
													})
												}
												aria-label="Attach file"
												className="absolute top-3 left-4 h-7 w-7 bg-zinc-400 dark:bg-zinc-500 hover:bg-zinc-500 dark:hover:bg-zinc-400 transition rounded-full p-1 flex items-center justify-center text-white dark:text-[#1E1F22] z-10 shadow-xs"
											>
												<Plus className="h-4 w-4" />
											</button>
										</ActionToolTip>

										<Input
											disabled={isLoading}
											className="pl-14 pr-24 py-6 bg-zinc-100 dark:bg-[#383A40] border-none focus-visible:ring-2 focus-visible:ring-[#5865F2]/50 focus-visible:ring-offset-0 text-zinc-800 dark:text-zinc-100 text-sm rounded-lg transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
											placeholder={`Message ${
												type === "conversation"
													? name
													: "#" + name
											} (Press Enter to send)`}
											{...field}
										/>

										<div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
											<EmojiPicker
												onChange={(emoji: string) =>
													field.onChange(
														`${field.value || ""} ${emoji}`.trim()
													)
												}
											/>
										</div>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>

			{/* Subtle Recruiter helper footer */}
			<div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 px-1 pt-1.5">
				<div className="flex items-center gap-1">
					<span className="font-mono bg-zinc-200 dark:bg-zinc-700/60 px-1 py-0.5 rounded text-[10px] text-zinc-600 dark:text-zinc-400">Return</span>
					<span>to send</span>
					<span className="mx-1">·</span>
					<span className="font-mono bg-zinc-200 dark:bg-zinc-700/60 px-1 py-0.5 rounded text-[10px] text-zinc-600 dark:text-zinc-400">Shift + Return</span>
					<span>for new line</span>
				</div>
				<div className="hidden sm:flex items-center gap-1">
					<Sparkles className="w-3 h-3 text-[#5865F2]" />
					<span>Socket.io WebSocket Sync</span>
				</div>
			</div>
		</div>
	);
};

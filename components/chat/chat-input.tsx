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
		<div data-tour="chat-input" className="chat-composer relative px-4 pb-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="composer-surface relative">
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
												className="absolute top-3 left-3 h-8 w-8 bg-white/5 hover:bg-primary/15 hover:text-primary transition rounded-lg p-1 flex items-center justify-center text-muted-foreground z-10 border border-white/[0.06]"
											>
												<Plus className="h-4 w-4" />
											</button>
										</ActionToolTip>

										<Input
											disabled={isLoading}
											className="h-14 pl-14 pr-16 bg-white/[0.025] border border-white/[0.065] focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 focus-visible:ring-offset-0 text-foreground text-[13px] rounded-xl transition placeholder:text-muted-foreground/60"
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
			<div className="composer-helper flex items-center justify-between text-[10px] text-muted-foreground/60 px-1 pt-1.5">
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

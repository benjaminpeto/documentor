"use client";
import { useEffect, useRef } from "react";
import { getSources, initialMessages, scrollToBottom } from "@/lib/utils";
import { ChatBubble } from "./chat-bubble";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message, useChat } from "ai/react";
import { Spinner } from "./ui/spinner";

export function Chat() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
		useChat({
			initialMessages,
		});

	useEffect(() => {
		setTimeout(() => scrollToBottom(containerRef), 100);
	}, [messages]);

	return (
		<div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
			<div className="p-6 overflow-auto gap-4 flex flex-col" ref={containerRef}>
				{messages.map(({ id, role, content }: Message, index) => (
					<ChatBubble
						key={id}
						role={role}
						content={content}
						// @ts-ignore
						sources={data?.length ? getSources(data, role, index) : []}
					/>
				))}
			</div>

			<form onSubmit={handleSubmit} className="p-4 flex clear-both">
				<Input
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message here..."
					className="mr-2"
				/>
				<Button className="w-24" type="submit">
					{isLoading ? <Spinner /> : "Ask"}
				</Button>
			</form>
		</div>
	);
}

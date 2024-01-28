import { ChatBubble } from "./chat-bubble";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message } from "ai/react";

export function Chat() {
	const message: Message[] = [
		{
			role: "assistant",
			content:
				"Hello, I am DocuMentor.ai. I am here to help you with your documentation needs. How can I help you today?",
			id: "1",
		},
		{
			role: "user",
			content: "Hey, I am the user, and in need of help please.",
			id: "2",
		},
	];

	const sources = ["I am the source one 1", "I am the source two 2"];

	return (
		<div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
			<div className="p-6 overflow-auto gap-4 flex flex-col">
				{message.map(({ id, role, content }: Message, index) => (
					<ChatBubble
						key={id}
						role={role}
						content={content}
						sources={role !== "assistant" ? [] : sources}
					/>
				))}
			</div>

			<form className="p-4 flex clear-both">
				<Input placeholder="Type your message here..." className="mr-2" />
				<Button className="w-24" type="submit">
					Ask
				</Button>
			</form>
		</div>
	);
}

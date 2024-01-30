import { NextRequest, NextResponse } from "next/server";
import { callChain } from "@/lib/langchain";
import { Message } from "ai";

const formatMessage = (message: Message) => {
	return `${message.role === "user" ? "Human" : "AI"}: ${message.content}`;
};

export async function POST(req: NextRequest) {
	const body = await req.json();
	const messages: Message[] = body.messages ?? [];
	console.log("Messages ", messages);
	const formattedPrevMessages = messages.slice(0, -1).map(formatMessage);
	const question = messages[messages.length - 1].content;

	// console.log("Chat history ", formattedPrevMessages.join("\n"));

	if (!question) {
		return NextResponse.json("Error: There was no question in the request", {
			status: 400,
		});
	}

	try {
		const streamingTextResponse = callChain({
			question,
			chatHistory: formattedPrevMessages.join("\n"),
		});
		return streamingTextResponse;
	} catch (error) {
		console.error("Internal server error ", error);
		return NextResponse.json("Error: Something went wrong. Try again!", {
			status: 500,
		});
	}
}

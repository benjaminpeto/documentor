import { Message } from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface Data {
	sources: string[];
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formattedText(inputText: string) {
	return inputText
		.replace(/\n+/g, " ") // Replace multiple consecutive new lines with a single space
		.replace(/(\w) - (\w)/g, "$1$2") // Join hyphenated words together
		.replace(/\s+/g, " "); // Replace multiple consecutive spaces with a single space
}

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function scrollToBottom(containerRef: React.RefObject<HTMLElement>) {
	if (containerRef.current) {
		const lastMessage = containerRef.current.lastElementChild;
		if (lastMessage) {
			const scrollOptions: ScrollIntoViewOptions = {
				behavior: "smooth",
				block: "end",
			};
			lastMessage.scrollIntoView(scrollOptions);
		}
	}
}

export const initialMessages: Message[] = [
	{
		role: "assistant",
		content:
			"Hello, I am DocuMentor.ai. I am here to help you with understanding your document. How can I help you today?",
		id: "1",
	},
];

export const getSources = (data: Data[], role: string, index: number) => {
	if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
		const sourcesIndex = (index - 2) / 2;
		if (data[sourcesIndex] && data[sourcesIndex].sources) {
			return data[sourcesIndex].sources;
		}
	}
	return [];
};

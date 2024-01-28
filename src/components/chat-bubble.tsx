import Balancer from "react-wrap-balancer";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import { formattedText } from "@/lib/utils";

const wrappedText = (text: string): React.ReactNode => {
	return text.split("\n").map((line, i) => (
		<span key={i}>
			{line}
			<br />
		</span>
	));
};

interface ChatBubbleProps extends Partial<Message> {
	sources: string[];
}

export function ChatBubble({
	role = "assistant",
	content,
	sources,
}: ChatBubbleProps) {
	if (!content) return null;

	const wrappedMessage = wrappedText(content);

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle
						className={
							role !== "assistant"
								? "text-red-500 dark:text-red-200"
								: "text-blue-500 dark:text-blue-200"
						}
					>
						{role === "assistant" ? "AI" : "You"}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-sm">
					<Balancer>{wrappedMessage}</Balancer>
				</CardContent>
				<CardFooter>
					<CardDescription className="w-full">
						{sources && sources.length ? (
							<Accordion type="single" collapsible className="w-full">
								{sources.map((source, i) => (
									<AccordionItem key={i} value={`source-${i}`}>
										<AccordionTrigger>{`Source ${i + 1}`}</AccordionTrigger>
										<AccordionContent>
											<ReactMarkdown>{formattedText(source)}</ReactMarkdown>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						) : null}
					</CardDescription>
				</CardFooter>
			</Card>
		</div>
	);
}

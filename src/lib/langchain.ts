import { ConversationalRetrievalQAChain } from "langchain/chains";
import {
	StreamingTextResponse,
	experimental_StreamData,
	LangChainStream,
} from "ai";
import { streamingModel, nonStreamingModel } from "./llm";
import { getVectorStore } from "./vector-store";
import { getPineconeClient } from "./pinecone-client";
import { STANDALONE_QUESTION_TEMPLATE, QA_TEMPLATE } from "./prompt-templates";

type callChainArgs = {
	question: string;
	chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
	try {
		const sanitisedQuestion = question.trim().replaceAll("\n", " ");
		const pineconeClient = await getPineconeClient();
		const vectorStore = await getVectorStore(pineconeClient);
		const { stream, handlers } = LangChainStream({
			experimental_streamData: true,
		});
		const data = new experimental_StreamData();

		const chain = ConversationalRetrievalQAChain.fromLLM(
			streamingModel,
			vectorStore.asRetriever(),
			{
				qaTemplate: QA_TEMPLATE,
				questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
				returnSourceDocuments: true,
				questionGeneratorChainOptions: {
					llm: nonStreamingModel,
				},
			}
		);
		chain
			.invoke({
				question: sanitisedQuestion,
				chat_history: chatHistory,
			}) // .[handlers]
			.then(async (res) => {
				const sourceDocuments = res?.sourceDocuments;
				const firstTwoDocuments = sourceDocuments.slice(0, 2);
				const pageContents = firstTwoDocuments.map(
					({ pageContent }: { pageContent: string }) => pageContent
				);
				console.log("already appended ", data);
				data.append({
					sources: pageContents,
				});
				data.close();
			});

		// Return the readable stream
		return new StreamingTextResponse(stream, {}, data);
	} catch (e) {
		console.error("error ", e);
		throw new Error("callChain() method failed!");
	}
}

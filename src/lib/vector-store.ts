import { env } from "./config";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";

type Doc<T> = T & { id: string };

export async function embedAndStoreDoc(
	client: Pinecone,
	// @ts-ignore
	docs: Document<Record<string, any>>[]
) {
	try {
		const embeddings = new OpenAIEmbeddings();
		const index = client.Index(env.PINECONE_INDEX_NAME);

		// Create embedding from PDF
		await PineconeStore.fromDocuments(docs, embeddings, {
			pineconeIndex: index,
			namespace: env.PINECONE_NAME_SPACE,
			textKey: "text",
		});
	} catch (e) {
		console.error("error ", e);
		throw new Error("Embedding and storing document FAILED!");
	}
}

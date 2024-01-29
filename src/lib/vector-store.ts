import { env } from "./config";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

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
			textKey: "text",
		});
	} catch (e) {
		console.error("error ", e);
		throw new Error("Embedding and storing document FAILED!");
	}
}

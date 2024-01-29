import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(): Promise<Pinecone> {
	try {
		const pineconeClient = new Pinecone({ apiKey: env.PINECONE_API_KEY });
		await pineconeClient.createIndex({
			name: env.PINECONE_INDEX_NAME,
			dimension: 1536,
			metric: "cosine",
			spec: {
				pod: {
					environment: env.PINECONE_ENVIRONMENT,
					podType: "p1.x1",
				},
			},
		});
		console.log(
			`Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
		);
		await delay(env.INDEX_INIT_TIMEOUT);
		console.log("Index created!!");
		return pineconeClient;
	} catch (error) {
		console.error("error ", error);
		throw new Error("Index creation failed");
	}
}

export async function getPineconeClient() {
	pineconeClientInstance = await createIndex();
	return pineconeClientInstance;
}

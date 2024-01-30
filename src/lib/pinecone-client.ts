import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone): Promise<Pinecone> {
	try {
		await client.createIndex({
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
		return client;
	} catch (error) {
		console.error("error ", error);
		throw new Error("Index creation failed");
	}
}

async function doesIndexExist() {
	const pineconeClient = new Pinecone({ apiKey: env.PINECONE_API_KEY });
	const indexName = env.PINECONE_INDEX_NAME;

	const existingIndexes = await pineconeClient.listIndexes();
	const isIndexExist = existingIndexes.indexes?.some(
		(index) => index.name === indexName
	);

	if (!isIndexExist) {
		createIndex(pineconeClient);
	} else {
		console.log("Your index already exists!");
	}
	return pineconeClient;
}

export async function getPineconeClient() {
	if (!pineconeClientInstance) {
		pineconeClientInstance = await doesIndexExist();
	}
	return pineconeClientInstance;
}

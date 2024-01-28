import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
	try {
		const pc = new Pinecone();
		await pc.createIndex({
			name: indexName,
			dimension: 1536,
			metric: "cosine",
			spec: {
				serverless: {
					cloud: "aws",
					region: "us-west-2",
				},
			},
		});

		console.log(
			`Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
		);
		await delay(env.INDEX_INIT_TIMEOUT);
		console.log("Index created!!");
	} catch (error) {
		console.error("error ", error);
		throw new Error("Index creation failed");
	}
}

async function initPineconeClient() {
	try {
		const pineconeClient = new Pinecone({
			apiKey: env.PINECONE_API_KEY,
		});
		const indexName = env.PINECONE_INDEX_NAME;
		const existingIndexes = await pineconeClient.listIndexes();

		if (!existingIndexes) {
			createIndex(pineconeClient, indexName);
		} else {
			console.log("Index already exists");
		}
		return pineconeClient;
	} catch (error) {
		console.error("error ", error);
		throw new Error("Pinecone client initialization failed");
	}
}

export async function getPineconeClient() {
	if (!pineconeClientInstance) {
		pineconeClientInstance = await initPineconeClient();
	}
	return pineconeClientInstance;
}

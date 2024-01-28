import { getChunkedDocsFromPDF } from "@/lib/pdf-loader";
import { embedAndStoreDoc } from "@/lib/vector-store";
import { getPineconeClient } from "@/lib/pinecone-client";

(async () => {
	try {
		const pineconeClient = await getPineconeClient();
		console.log("Preparing chunks from PDF file");

		const docs = await getChunkedDocsFromPDF();
		console.log(`Loading ${docs.length} chunks into pinecone...`);

		await embedAndStoreDoc(pineconeClient, docs);
		console.log("Data embedded and stored in Pinecone index");
	} catch (error) {
		console.error("Init client script failed ", error);
	}
})();

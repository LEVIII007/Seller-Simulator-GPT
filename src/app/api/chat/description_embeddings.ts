const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client } = require('pg');

const pgEndpoint = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
};

// searchProductDescription.ts
export async function searchProductDescription(prompt: string, matchThreshold: number, matchCnt: number): Promise<{ error: string; } | { name: any; description: any; price: any; discount: any; }[]> {
    try {
        console.log("searchProductDescription called!!!!!!!!!!!!!");
        const googleai = new GoogleGenerativeAI(process.env.API_KEY).getGenerativeModel({ model: "text-embedding-004" });
        console.log("googleai created!!!!!!!!!!!!!");
        const client = new Client(pgEndpoint);
        console.log("client created!!!!!!!!!!!!!");

        await client.connect();
        console.log("Connected to Postgres");

        prompt = prompt.replace(/\n/g, ' ');

        const result = await googleai.embedContent(prompt);
        const embedding = result.embedding;

        if (!embedding || !embedding.values) {
            return { "error": "Failed to generate an embedding for the prompt" };
        }
        const embeddingStr = '[' + embedding.values + ']';

        const res = await client.query(
            "SELECT product_name, product_description, retail_price, discounted_price, 1 - (Description_embed <=> $1) as similarity " +
            "FROM Products WHERE 1 - (Description_embed <=> $1) > $2 ORDER BY Description_embed <=> $1 LIMIT $3",
            [embeddingStr, matchThreshold, matchCnt]);

        let places = [];

        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];

            places.push({
                name: row.product_name,
                description: row.product_description,
                price: row.retail_price,
                discount: row.discounted_price
            });

            console.log("\n\n--------------------------------------------------");
        }

        await client.end();
        return places;
    } catch (error) {
        console.error("An error occurred:", error);
        return { "error": "An unexpected error occurred" };
    }
}

export async function searchProductCategory(prompt: string, matchThreshold: number, matchCnt: number): Promise<{ error: string; } | { name: any; description: any; price: any; discount: any; }[]> {
    try {
        console.log("searchProductCategory called!!!!!!!!!!!!!");
        const googleai = new GoogleGenerativeAI(process.env.API_KEY).getGenerativeModel({ model: "text-embedding-004" });
        console.log("googleai created!!!!!!!!!!!!!");
        const client = new Client(pgEndpoint);
        console.log("client created!!!!!!!!!!!!!");

        await client.connect();
        console.log("Connected to Postgres");

        prompt = prompt.replace(/\n/g, ' ');

        const result = await googleai.embedContent(prompt);
        const embedding = result.embedding;

        if (!embedding || !embedding.values) {
            return { "error": "Failed to generate an embedding for the prompt" };
        }
        const embeddingStr = '[' + embedding.values + ']';

        const res = await client.query(
            "SELECT product_name, product_description, retail_price, discounted_price, 1 - (Category_embed <=> $1) as similarity " +
            "FROM Products WHERE 1 - (Category_embed <=> $1) > $2 ORDER BY Category_embed <=> $1 LIMIT $3",
            [embeddingStr, matchThreshold, matchCnt]);

        let places = [];

        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];

            places.push({
                name: row.product_name,
                description: row.product_description,
                price: row.retail_price,
                discount: row.discounted_price
            });

            console.log("\n\n--------------------------------------------------");
        }

        await client.end();
        return places;
    } catch (error) {
        console.error("An error occurred:", error);
        return { "error": "An unexpected error occurred" };
    }
}




export default {
    searchProductDescription,
    searchProductCategory
};
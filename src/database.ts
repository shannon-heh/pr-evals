import { MongoClient } from "mongodb";

// Helper method to connect to DB
export async function getDB() {
    const client = new MongoClient(process.env.DATABASE_URL);
    const dbName = "course-evals-iw";
    await client.connect();
    return client.db(dbName);
}

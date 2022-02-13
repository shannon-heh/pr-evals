import { MongoClient } from "mongodb";

// Global DB object
let db = null; 

// Connect to MongoDB
async function connect() {
    const client = new MongoClient(process.env.DATABASE_URL);
    const dbName = "course-evals-iw";
    await client.connect();
    db = client.db(dbName);
}

// Return DB object
export async function getDB() {
    if (db == null) {
        await connect();
    }
    return db;
}

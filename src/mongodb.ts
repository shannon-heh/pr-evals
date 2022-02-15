import { MongoClient } from "mongodb";

// Reference: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js

// Connect to MongoDB
async function connect() {
    const client = new MongoClient(process.env.DATABASE_URL);
    const dbName = "course-evals-iw";
    await client.connect();
    return client.db(dbName);
}

// Return DB object
export async function getDB() {
    // In development mode, set global DB object
    if (process.env.NODE_ENV === 'development') {
        if (!global.db) {
            global.db = await connect();
        }
        return global.db
    } else {
        return await connect();
    }
}
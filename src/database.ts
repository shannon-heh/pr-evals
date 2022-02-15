import {getDB} from "./mongodb";

export async function getDepartments() {
    const db = await getDB();
    return await db.collection("admin").findOne({}, {projection: {"_id": 0, "majors": 1}})
}
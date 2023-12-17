// Import the latest major version of the MongoDB driver
import { MongoClient,Db } from "npm:mongodb@6";

let db: Db

export async function connect() {
    // Configure a MongoDB client
    const url = 'mongodb+srv://githubcreds:githubcreds@nodejscourse.tdqni9o.mongodb.net/'
    const client = new MongoClient(url)
    const dbName = 'denoTodos'

    // Connect to a MongoDB instance
    await client.connect()
    console.log("Connected successfully to server")

    // Get a reference to a collection
    db = client.db(dbName)
}

export function getDb() {
    return db
}
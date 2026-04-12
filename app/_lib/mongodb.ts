import 'server-only'

import { MongoClient, ServerApiVersion, type Db } from 'mongodb'

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
}

let mongoClient: MongoClient | undefined
let mongoClientPromise: Promise<MongoClient> | undefined

declare global {
    var _mongoClient: MongoClient | undefined
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri() {
    const uri = process.env.MONGODB_URI

    if (!uri) {
        throw new Error('Missing MONGODB_URI. Add it to your environment variables.')
    }

    return uri
}

function createMongoClient() {
    return new MongoClient(getMongoUri(), options)
}

export function getMongoClientInstance() {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClient) {
            global._mongoClient = createMongoClient()
        }

        return global._mongoClient
    }

    if (!mongoClient) {
        mongoClient = createMongoClient()
    }

    return mongoClient
}

export async function getMongoClient() {
    const client = getMongoClientInstance()

    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            global._mongoClientPromise = client.connect()
        }

        return global._mongoClientPromise
    }

    if (!mongoClientPromise) {
        mongoClientPromise = client.connect()
    }

    return mongoClientPromise
}

export function getDatabaseHandle(name = process.env.MONGODB_DB): Db {
    if (!name) {
        throw new Error('Missing MONGODB_DB. Add it to your environment variables.')
    }

    return getMongoClientInstance().db(name)
}

export async function getDatabase(name = process.env.MONGODB_DB): Promise<Db> {
    if (!name) {
        throw new Error('Missing MONGODB_DB. Add it to your environment variables.')
    }

    const client = await getMongoClient()
    
    return client.db(name)
}

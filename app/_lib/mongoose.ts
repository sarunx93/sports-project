import 'server-only'

import mongoose from 'mongoose'

type MongooseCache = {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    var _mongoose: MongooseCache | undefined
}

const cached = global._mongoose ?? { conn: null, promise: null }

if (!global._mongoose) {
    global._mongoose = cached
}

export async function connectMongoose() {
    const uri = process.env.MONGODB_URI
    const dbName = process.env.MONGODB_DB

    if (!uri) {
        throw new Error('Missing MONGODB_URI. Add it to your environment variables.')
    }

    if (!dbName) {
        throw new Error('Missing MONGODB_DB. Add it to your environment variables.')
    }

    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            dbName,
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise

    return cached.conn
}

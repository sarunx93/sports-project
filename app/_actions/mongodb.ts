'use server'

import { getDatabase } from '@/app/_lib/mongodb'

export type MongoConnectionResult =
    | {
          ok: true
          database: string
          message: string
      }
    | {
          ok: false
          message: string
      }

export async function pingMongoAction(): Promise<MongoConnectionResult> {
    try {
        const db = await getDatabase()

        await db.command({ ping: 1 })

        return {
            ok: true,
            database: db.databaseName,
            message: 'MongoDB connection is healthy.',
        }
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Unknown MongoDB error',
        }
    }
}

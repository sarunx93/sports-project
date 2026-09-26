import 'server-only'

import { Schema, model, models, type InferSchemaType } from 'mongoose'

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    clerkUserId: {
        type: String,
        required: true,
        trim: true,
    },
    clubName: {
        type: String,
        required: true,
        trim: true,
    },
    sports: {
        type: String,
        enum: ['Badminton', 'Tennis', 'Football'],
        required: true,
    },
    stats: {
        numPlayers: { average: Number, latest: Number },
        numShuttles: { average: Number, latest: Number },
    },
    schedule: [
        {
            day: { type: String, enum: DAYS_OF_WEEK, required: true },
            time: { type: String, required: true },
        },
    ],
})

export type UserDocument = InferSchemaType<typeof userSchema>

const UserModel = models.User || model<UserDocument>('User', userSchema)

export default UserModel

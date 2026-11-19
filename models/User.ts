import 'server-only'

import { Schema, model, models, type InferSchemaType } from 'mongoose'

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const numPlayersSchema = new Schema(
    {
        avg: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        latest: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        sessionCount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    {
        _id: false,
    },
)
const numShuttlesSchema = new Schema(
    {
        avg: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        latest: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        sessionCount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
    },
    {
        _id: false,
    },
)

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
        numPlayers: {
            type: numPlayersSchema,
            default: () => ({
                avg: 0,
                latest: 0,
                sessionCount: 0,
            }),
        },
        numShuttles: {
            type: numShuttlesSchema,
            default: () => ({
                avg: 0,
                latest: 0,
                sessionCount: 0,
            }),
        },
    },
    schedule: [
        {
            day: { type: String, enum: DAYS_OF_WEEK, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
        },
    ],
})

export type UserDocument = InferSchemaType<typeof userSchema>

const UserModel = models.User || model<UserDocument>('User', userSchema)

export default UserModel

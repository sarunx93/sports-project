import 'server-only'

import { Schema, model, models, type InferSchemaType } from 'mongoose'

const playerSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
)

const teamsSchema = new Schema(
    {
        A: {
            type: [playerSchema],
            required: true,
            default: [],
        },
        B: {
            type: [playerSchema],
            required: true,
            default: [],
        },
    },
    {
        _id: false,
    },
)

const recordedBySchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
)

const matchSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        teams: {
            type: teamsSchema,
            required: true,
        },
        duration: {
            type: String,
            required: true,
            trim: true,
        },
        recordedBy: {
            type: recordedBySchema,
            required: true,
        },
        scoreA: {
            type: String,
            required: true,
            trim: true,
        },
        scoreB: {
            type: String,
            required: true,
            trim: true,
        },
        winner: {
            type: String,
            enum: ['A', 'B'],
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export type MatchPlayer = InferSchemaType<typeof playerSchema>
export type MatchTeams = InferSchemaType<typeof teamsSchema>
export type MatchRecordedBy = InferSchemaType<typeof recordedBySchema>
export type MatchDocument = InferSchemaType<typeof matchSchema>

const MatchModel = models.Match || model<MatchDocument>('Match', matchSchema)

export default MatchModel

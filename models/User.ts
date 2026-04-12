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

const userSchema = new Schema({
    userName: {
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
    matches: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Match',
        },
    ],
    players: {
        type: [playerSchema],
        default: [],
    },
})

export type UserDocument = InferSchemaType<typeof userSchema>

const UserModel = models.User || model<UserDocument>('User', userSchema)

export default UserModel

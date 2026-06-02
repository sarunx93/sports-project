'use server'

import type { EndedMatch } from '@/app/_stores/badminton-store'
import type { Player } from '@/app/_utils/constants'
import type { PersistedUserProfile } from '@/app/_stores/user-store'
import type { Sport } from '@/app/_utils/types'
import { connectMongoose } from '@/app/_lib/mongoose'
import { validateBadmintonMatch } from '@/app/_utils/badminton-score'
import MatchModel from '@/models/Match'
import UserModel from '@/models/User'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export type RecordMatchResult =
    | {
          ok: true
          matchId: string
          message: string
      }
    | {
          ok: false
          message: string
      }

export type CreateUserState = {
    ok: boolean
    message: string
    userProfile: PersistedUserProfile | null
    errors: {
        clubName?: string
        sports?: string
    }
}

export type AddPlayerToClubResult =
    | {
          ok: true
          message: string
      }
    | {
          ok: false
          message: string
      }

export async function recordMatch(match: EndedMatch): Promise<RecordMatchResult> {
    const user = await currentUser()
    const data = {
        userId: user?.id,
        name: user?.firstName,
        email: user?.emailAddresses[0].emailAddress,
        role: 'player',
    }
    let matchData = {}
    if (match.scoreA && match.scoreB) {
        const validation = validateBadmintonMatch(match.scoreA, match.scoreB)
        if (!validation.ok) {
            return {
                ok: false,
                message:
                    validation.errors.general ??
                    validation.errors.scoreA ??
                    validation.errors.scoreB ??
                    'Invalid badminton match score.',
            }
        }
        matchData = {
            id: match.id,
            teams: {
                A: match.teams.A,
                B: match.teams.B,
            },
            duration: match.duration,
            recordedBy: data,
            scoreA: validation.scoreA,
            scoreB: validation.scoreB,
            winner: validation.winner,
        }
    } else {
        matchData = {
            id: match.id,
            teams: {
                A: match.teams.A,
                B: match.teams.B,
            },
            duration: match.duration,
            recordedBy: data,
            // scoreA: validation.scoreA,
            // scoreB: validation.scoreB,
            // winner: validation.winner,
        }
    }
    try {
        await connectMongoose()

        const savedMatch = await MatchModel.create(matchData)

        return {
            ok: true,
            matchId: savedMatch._id.toString(),
            message: 'Match recorded successfully.',
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return {
                ok: false,
                message: `Match ${match.id} has already been recorded.`,
            }
        }

        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Unknown error while recording match.',
        }
    }
}

export async function createUser(prevState: CreateUserState, formData: FormData) {
    const clubName = String(formData.get('clubName') ?? '').trim()
    const sports = String(formData.get('sports') ?? '').trim() as Sport

    if (!clubName) {
        return {
            ok: false,
            message: '',
            userProfile: prevState.userProfile,
            errors: { clubName: 'Club name is required.' },
        }
    }

    if (!sports) {
        return {
            ok: false,
            message: '',
            userProfile: prevState.userProfile,
            errors: { sports: 'Please select a sport.' },
        }
    }

    const { userId } = await auth()
    if (!userId) {
        return {
            ok: false,
            message: 'Unauthorized.',
            userProfile: prevState.userProfile,
            errors: {},
        }
    }
    const clerkUser = await currentUser()
    if (!clerkUser) {
        return {
            ok: false,
            message: 'Unauthorized.',
            userProfile: prevState.userProfile,
            errors: {},
        }
    }

    const userName =
        clerkUser.firstName ?? clerkUser.fullName ?? clerkUser.primaryEmailAddress?.emailAddress ?? 'Player'
    const email = clerkUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null
    await connectMongoose()

    // Backfill older user documents that were created before the players field existed.
    await UserModel.updateOne({ clerkUserId: userId, players: { $exists: false } }, { $set: { players: [] } })

    await UserModel.findOneAndUpdate(
        { clerkUserId: userId },
        {
            $set: {
                userName,
                clubName,
                sports,
                email,
            },
            $setOnInsert: {
                clerkUserId: userId,
                matches: [],
                players: [],
            },
        },
        { upsert: true, new: true },
    )
    redirect(`/sports/${sports.toLowerCase()}`)
    return {
        ok: true,
        message: 'Club created successfully.',
        userProfile: {
            userName,
            clubName,
            email,
            sports,
        },
        errors: {},
    }
}

export async function addPlayersToClub(player: Player, userId: string): Promise<AddPlayerToClubResult> {
    try {
        await connectMongoose()

        const result = await UserModel.updateOne(
            { clerkUserId: userId },
            {
                $push: {
                    players: player,
                },
            },
        )

        if (result.matchedCount === 0) {
            return {
                ok: false,
                message: 'Club not found for this user.',
            }
        }

        return {
            ok: true,
            message: 'Player added to database.',
        }
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Unknown error while adding player.',
        }
    }
}

export async function getWaitingPlayers(userId: string): Promise<Player[]> {
    await connectMongoose()

    const user = await UserModel.findOne({ clerkUserId: userId }, { players: 1, _id: 0 }).lean<{ players?: Player[] }>()

    return user?.players ?? []
}

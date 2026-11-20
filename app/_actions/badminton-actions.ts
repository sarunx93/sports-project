'use server'

import type { EndedMatch } from '@/app/_stores/badminton-store'
import { sports, type Player } from '@/app/_utils/constants'
import type { PersistedUserProfile } from '@/app/_stores/user-store'
import type { Sport } from '@/app/_utils/types'
import { connectMongoose } from '@/app/_lib/mongoose'
import { validateBadmintonMatch } from '@/app/_utils/badminton-score'
import MatchModel from '@/models/Match'
import UserModel from '@/models/User'
import { auth, currentUser, User } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { normalizeUserProfile } from '@/app/_stores/user-store'

type SessionCountStats = {
    avg: number
    latest: number
    sessionCount: number
}

export type ClubStats = {
    numPlayers: SessionCountStats
    numShuttles: SessionCountStats
}

export type ClubStatsResponse = {
    stats: ClubStats
}

export type RecordSessionResult =
    | {
          ok: true
          numPlayers: SessionCountStats
          numShuttles: SessionCountStats
      }
    | {
          ok: false
          message: string
      }

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
        schedule?: string
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

export async function getClubStats(): Promise<ClubStatsResponse | null> {
    const user = await currentUser()
    if (!user) {
        return null
    }
    const { id } = user

    const clubStats = await UserModel.findOne({ clerkUserId: id })
    const { stats } = clubStats
    return stats
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

export async function getUser() {
    const { userId } = await auth()
    let fetchedUser
    if (!userId) {
        redirect('/login')
    }

    try {
        fetchedUser = await UserModel.findOne({ clerkUserId: userId })
        if (!fetchedUser) {
            return {
                ok: false,
                message: '',
                errors: { clubName: 'Club name is required.' },
            }
        }
        return {
            clubName: fetchedUser?.clubName,
            username: fetchedUser.userName,
            schedule: (fetchedUser.schedule ?? []).map((session) => ({
                day: session.day,
                startTime: session.startTime,
                endTime: session.endTime,
            })),
            sports: fetchedUser.sports,
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateUserProfile(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
    const { userId } = await auth()

    if (!userId) {
        return {
            ok: false,
            message: 'กรุณาเข้าสู่ระบบก่อนแก้ไขข้อมูล',
            userProfile: null,
            errors: {},
        }
    }

    let schedule: unknown
    const clubName = formData.get('clubName')
    const sports = formData.get('sports')

    try {
        schedule = JSON.parse(String(formData.get('schedule') ?? '[]'))
    } catch {
        return {
            ok: false,
            message: 'กรุณาตรวจสอบตารางเล่น',
            userProfile: null,
            errors: {
                schedule: 'รูปแบบตารางเล่นไม่ถูกต้อง',
            },
        }
    }
    let userProfile: PersistedUserProfile
    try {
        await connectMongoose()
        const updatedUser = await UserModel.findOneAndUpdate(
            { clerkUserId: userId },
            {
                $set: {
                    clubName: clubName,
                    sports: sports,
                    schedule: schedule,
                },
            },
            {
                new: true,
                runValidators: true,
                upsert: false,
            },
        )
        userProfile = normalizeUserProfile(updatedUser)
    } catch (error) {
        console.error('Failed to update user profile:', error)

        return {
            ok: false,
            message: 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
            userProfile: null,
            errors: {},
        }
    }
    revalidatePath('/', 'layout')

    return {
        ok: true,
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        userProfile,
        errors: {},
    }
}

export async function createUser(prevState: CreateUserState, formData: FormData) {
    const clubName = String(formData.get('clubName') ?? '').trim()
    const sports = String(formData.get('sports') ?? '').trim() as Sport
    let schedule = formData.get('schedule')

    try {
        schedule = JSON.parse(String(schedule))
    } catch {
        schedule = null
    }
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

    const savedUser = await UserModel.findOneAndUpdate(
        { clerkUserId: userId },
        {
            $set: {
                userName,
                clubName,
                sports,
                email,
                schedule,
            },
            $setOnInsert: {
                clerkUserId: userId,
                stats: {
                    numPlayers: { avg: 0, latest: 0, sessionCount: 0 },
                    numShuttles: { avg: 0, latest: 0, sessionCount: 0 },
                },
            },
        },
        { upsert: true, new: true },
    )

    return {
        ok: true,
        message: 'Club created successfully.',
        userProfile: normalizeUserProfile(savedUser),
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

function buildSessionCountUpdate(field: 'numPlayers' | 'numShuttles', latest: number) {
    return {
        $let: {
            vars: {
                oldAverage: { $ifNull: [`$stats.${field}.avg`, 0] },
                oldSessionCount: { $ifNull: [`$stats.${field}.sessionCount`, 0] },
            },
            in: {
                latest,
                avg: {
                    $divide: [
                        {
                            $add: [{ $multiply: ['$$oldAverage', '$$oldSessionCount'] }, latest],
                        },
                        { $add: ['$$oldSessionCount', 1] },
                    ],
                },
                sessionCount: { $add: ['$$oldSessionCount', 1] },
            },
        },
    }
}

export async function recodeSession(
    latestPlayerCount: number,
    latestShuttlesCount: number,
): Promise<RecordSessionResult> {
    const { userId } = await auth()

    if (!userId) {
        return {
            ok: false,
            message: 'Unauthorized',
        }
    }

    if (
        !Number.isSafeInteger(latestPlayerCount) ||
        !Number.isSafeInteger(latestShuttlesCount) ||
        latestPlayerCount < 1 ||
        latestShuttlesCount < 1
    ) {
        return {
            ok: false,
            message: 'จำนวนผู้เล่นและจำนวนลูกต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป',
        }
    }

    try {
        await connectMongoose()
        const user = await UserModel.findOneAndUpdate(
            {
                clerkUserId: userId,
            },
            [
                {
                    $set: {
                        'stats.numPlayers': buildSessionCountUpdate('numPlayers', latestPlayerCount),
                        'stats.numShuttles': buildSessionCountUpdate('numShuttles', latestShuttlesCount),
                    },
                },
            ],
            { returnDocument: 'after', updatePipeline: true },
        ).lean<{
            stats: {
                numPlayers: SessionCountStats
                numShuttles: SessionCountStats
            }
        }>()

        if (!user) {
            return {
                ok: false,
                message: 'Club not found',
            }
        }
        return {
            ok: true,
            numPlayers: user.stats.numPlayers,
            numShuttles: user.stats.numShuttles,
        }
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Unable to record session.',
        }
    }
}

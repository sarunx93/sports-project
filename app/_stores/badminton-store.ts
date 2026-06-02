import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { type Player } from '../_utils/constants'
import type { MatchWinner } from '../_utils/badminton-score'
import { v4 as uuidv4 } from 'uuid'

export const BADMINTON_STORE_STORAGE_KEY = 'badminton-store'

export type MatchTypes = 'singles' | 'doubles'

type PersistedBadmintonStore = {
    state?: Partial<MatchArrangeState>
    version?: number
}

type TeamName = 'A' | 'B'
type TeamPlayers = Record<TeamName, Player[]>

export type PlayingMatches = {
    id: string
    teams: TeamPlayers
    type?: MatchTypes
    matchNumber: number
}

export type EndedMatch = PlayingMatches & { duration: string; scoreA?: string; scoreB?: string; winner: MatchWinner }

type NewPlayerInput = Omit<Player, 'id'>

type DragLocation = {
    team: TeamName
    slotIndex: number
}

export type TimerStatus = 'idle' | 'running' | 'paused'

export type MatchTimerState = {
    status: TimerStatus
    startedAt: number | null
    accumulatedMs: number
}

export const DEFAULT_MATCH_TIMER_STATE: MatchTimerState = {
    status: 'idle',
    startedAt: null,
    accumulatedMs: 0,
}

type MatchArrangeState = {
    waitingList: Player[]
    teams: TeamPlayers
    playingMatches: PlayingMatches[]
    endedMatches: EndedMatch[]
    matchTimers: Record<number, MatchTimerState>
    matchTypes: MatchTypes
}

type MatchArrangeActions = {
    addPlayerToTeam: (player: Player) => void
    addPlayerToWaitingList: (player: NewPlayerInput) => void
    removePlayerFromWaitingList: (player: Player) => void
    removeAllPlayersFromWaitingList: () => void
    removePlayerFromMatch: (player: Player) => void
    swapPlayers: (source: DragLocation, target: DragLocation) => void
    startMatch: (teamA: Player[], teamB: Player[], type: MatchTypes) => void
    endMatch: (match: PlayingMatches, result: Pick<EndedMatch, 'duration' | 'scoreA' | 'scoreB' | 'winner'>) => void
    startTimer: (matchId: number) => void
    pauseTimer: (matchId: number) => void
    resumeTimer: (matchId: number) => void
    resetTimer: (matchId: number) => void
    setMatchType: (matchTypeInput: MatchTypes) => void
}

export type MatchArrangeStore = MatchArrangeState & MatchArrangeActions

function createDefaultMatchTimerState(): MatchTimerState {
    return { ...DEFAULT_MATCH_TIMER_STATE }
}

function createDefaultMatchArrangeState(initialWaitingList: Player[] = []): MatchArrangeState {
    return {
        waitingList: initialWaitingList,
        teams: {
            A: [],
            B: [],
        },
        playingMatches: [],
        endedMatches: [],
        matchTimers: {},
        matchTypes: 'doubles',
    }
}

function getPlayersPerTeam(matchType: MatchTypes) {
    return matchType === 'singles' ? 1 : 2
}

function getNextPlayerId(state: MatchArrangeState) {
    const ids = [
        ...state.waitingList.map((player) => player.id),
        ...state.teams.A.map((player) => player.id),
        ...state.teams.B.map((player) => player.id),
        ...state.playingMatches.flatMap((match) => [...match.teams.A, ...match.teams.B].map((player) => player.id)),
        ...state.endedMatches.flatMap((match) => [...match.teams.A, ...match.teams.B].map((player) => player.id)),
    ]

    return Math.max(0, ...ids) + 1
}

export function getElapsedMatchTimerMs(timer: MatchTimerState, now = Date.now()) {
    if (timer.status !== 'running' || timer.startedAt === null) {
        return timer.accumulatedMs
    }

    return timer.accumulatedMs + (now - timer.startedAt)
}

export function clearPersistedBadmintonState() {
    if (typeof window === 'undefined') {
        return
    }

    const persistedValue = window.localStorage.getItem(BADMINTON_STORE_STORAGE_KEY)

    if (!persistedValue) {
        return
    }

    try {
        const parsedValue = JSON.parse(persistedValue) as PersistedBadmintonStore

        window.localStorage.setItem(
            BADMINTON_STORE_STORAGE_KEY,
            JSON.stringify({
                ...parsedValue,
                state: createDefaultMatchArrangeState(),
            }),
        )
    } catch {
        window.localStorage.removeItem(BADMINTON_STORE_STORAGE_KEY)
    }
}

export const createBadmintonStore = (initialWaitingList: Player[] = []) =>
    createStore<MatchArrangeStore>()(
        persist(
            (set) => ({
                ...createDefaultMatchArrangeState(initialWaitingList),
                addPlayerToWaitingList: (player) =>
                    set((state) => {
                        const name = player.name.trim()
                        const lastName = player.lastName.trim()
                        const level = player.level.trim()

                        if (!name || !lastName || !level) {
                            return state
                        }

                        return {
                            waitingList: [
                                ...state.waitingList,
                                {
                                    id: getNextPlayerId(state),
                                    name,
                                    lastName,
                                    level,
                                },
                            ],
                        }
                    }),
                removePlayerFromWaitingList: (player: Player) =>
                    set((state) => ({
                        waitingList: state.waitingList.filter((p) => p.id !== player.id),
                    })),
                setMatchType: (matchTypeInput: MatchTypes) =>
                    set((state) => {
                        if (state.matchTypes === matchTypeInput) {
                            return state
                        }

                        const playersPerTeam = getPlayersPerTeam(matchTypeInput)
                        const nextTeamA = state.teams.A.slice(0, playersPerTeam)
                        const nextTeamB = state.teams.B.slice(0, playersPerTeam)
                        const overflowPlayers = [
                            ...state.teams.A.slice(playersPerTeam),
                            ...state.teams.B.slice(playersPerTeam),
                        ]

                        return {
                            ...state,
                            waitingList: [...overflowPlayers, ...state.waitingList],
                            teams: {
                                A: nextTeamA,
                                B: nextTeamB,
                            },
                            matchTypes: matchTypeInput,
                        }
                    }),
                removeAllPlayersFromWaitingList: () =>
                    set((state) => ({
                        ...state,
                        waitingList: [],
                    })),
                startTimer: (matchId) =>
                    set((state) => {
                        const matchExists = state.playingMatches.some((match) => match.id === matchId)

                        if (!matchExists) {
                            return state
                        }

                        return {
                            ...state,
                            matchTimers: {
                                ...state.matchTimers,
                                [matchId]: {
                                    status: 'running',
                                    startedAt: Date.now(),
                                    accumulatedMs: 0,
                                },
                            },
                        }
                    }),
                pauseTimer: (matchId) =>
                    set((state) => {
                        const timer = state.matchTimers[matchId]

                        if (!timer || timer.status !== 'running' || timer.startedAt === null) {
                            return state
                        }
                        return {
                            ...state,
                            matchTimers: {
                                ...state.matchTimers,
                                [matchId]: {
                                    status: 'paused',
                                    startedAt: null,
                                    accumulatedMs: getElapsedMatchTimerMs(timer),
                                },
                            },
                        }
                    }),
                resumeTimer: (matchId) =>
                    set((state) => {
                        const timer = state.matchTimers[matchId]

                        if (!timer || timer.status !== 'paused') {
                            return state
                        }

                        return {
                            ...state,
                            matchTimers: {
                                ...state.matchTimers,
                                [matchId]: {
                                    ...timer,
                                    status: 'running',
                                    startedAt: Date.now(),
                                },
                            },
                        }
                    }),
                resetTimer: (matchId) =>
                    set((state) => {
                        if (!state.matchTimers[matchId]) {
                            return state
                        }

                        return {
                            ...state,
                            matchTimers: {
                                ...state.matchTimers,
                                [matchId]: createDefaultMatchTimerState(),
                            },
                        }
                    }),
                addPlayerToTeam: (player) =>
                    set((state) => {
                        const playerExists = [...state.teams.A, ...state.teams.B].some(({ id }) => id === player.id)

                        if (playerExists) {
                            return state
                        }

                        const playersPerTeam = getPlayersPerTeam(state.matchTypes)
                        console.log('playersPerTeam', playersPerTeam)
                        if (state.teams.A.length < playersPerTeam) {
                            return {
                                waitingList: state.waitingList.filter((p) => p.id !== player.id),
                                teams: {
                                    ...state.teams,
                                    A: [...state.teams.A, player],
                                },
                            }
                        }

                        if (state.teams.B.length < playersPerTeam) {
                            return {
                                waitingList: state.waitingList.filter((p) => p.id !== player.id),
                                teams: {
                                    ...state.teams,
                                    B: [...state.teams.B, player],
                                },
                            }
                        }

                        return state
                    }),
                removePlayerFromMatch: (player: Player) =>
                    set((state) => {
                        const remainingPlayersA = state.teams.A.filter((p) => p.id !== player.id)
                        const remainingPlayersB = state.teams.B.filter((p) => p.id !== player.id)

                        return {
                            ...state,
                            waitingList: [player, ...state.waitingList],
                            teams: {
                                A: [...remainingPlayersA],
                                B: [...remainingPlayersB],
                            },
                        }
                    }),
                swapPlayers: (source, target) =>
                    set((state) => {
                        if (source.team === target.team && source.slotIndex === target.slotIndex) {
                            return state
                        }

                        const nextTeams: TeamPlayers = {
                            A: [...state.teams.A],
                            B: [...state.teams.B],
                        }

                        const sourcePlayer = nextTeams[source.team][source.slotIndex]
                        const targetPlayer = nextTeams[target.team][target.slotIndex]

                        if (!sourcePlayer || !targetPlayer) {
                            return state
                        }

                        nextTeams[source.team][source.slotIndex] = targetPlayer
                        nextTeams[target.team][target.slotIndex] = sourcePlayer

                        return {
                            ...state,
                            teams: nextTeams,
                        }
                    }),
                startMatch: (teamA: Player[], teamB: Player[], type: MatchTypes) =>
                    set((state) => {
                        const matchId = uuidv4()

                        const matchNumber = Math.max(0, state.playingMatches.length) + 1
                        console.log(matchNumber)
                        return {
                            ...state,
                            teams: { A: [], B: [] },
                            playingMatches: [
                                ...state.playingMatches,
                                {
                                    id: matchId,
                                    teams: {
                                        A: [...teamA],
                                        B: [...teamB],
                                    },
                                    type,
                                    matchNumber,
                                },
                            ],
                            matchTimers: {
                                ...state.matchTimers,
                                [matchId]: createDefaultMatchTimerState(),
                            },
                        }
                    }),
                endMatch: (match: PlayingMatches, result) =>
                    set((state) => {
                        const teamA = match.teams.A
                        const teamB = match.teams.B
                        const remainingMatchTimers = { ...state.matchTimers }

                        delete remainingMatchTimers[match.id]

                        return {
                            ...state,
                            waitingList: [...teamA, ...teamB, ...state.waitingList],
                            playingMatches: state.playingMatches.filter((playingMatch) => playingMatch.id !== match.id),
                            endedMatches: [
                                ...state.endedMatches,
                                {
                                    id: match.id,
                                    teams: {
                                        A: [...teamA],
                                        B: [...teamB],
                                    },
                                    duration: result.duration,
                                    scoreA: result.scoreA,
                                    scoreB: result.scoreB,
                                    winner: result.winner,
                                },
                            ],
                            matchTimers: remainingMatchTimers,
                        }
                    }),
            }),
            {
                name: BADMINTON_STORE_STORAGE_KEY,
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    waitingList: state.waitingList,
                    teams: state.teams,
                    playingMatches: state.playingMatches,
                    endedMatches: state.endedMatches,
                    matchTimers: state.matchTimers,
                    matchTypes: state.matchTypes,
                }),
                skipHydration: true,
            },
        ),
    )

export type BadmintonStoreApi = ReturnType<typeof createBadmintonStore>

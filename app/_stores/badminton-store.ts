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
    courtNumber: string
}

export type EndedMatch = PlayingMatches & { duration: string; scoreA: string; scoreB: string; winner: MatchWinner }

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
    matchTimers: Record<string, MatchTimerState>
    matchTypes: MatchTypes
}

type MatchArrangeActions = {
    addPlayerToTeam: (player: Player) => void
    addPlayerToWaitingList: (player: NewPlayerInput) => void
    removePlayerFromWaitingList: (player: Player) => void
    removeAllPlayersFromWaitingList: () => void
    removePlayerFromMatch: (player: Player) => void
    removePlayingMatch: (match: PlayingMatches) => void
    swapPlayers: (source: DragLocation, target: DragLocation) => void
    startMatch: (teamA: Player[], teamB: Player[], type: MatchTypes, courtNumber: string) => void
    endMatch: (match: PlayingMatches, result: Pick<EndedMatch, 'duration' | 'scoreA' | 'scoreB' | 'winner'>) => void
    startTimer: (matchId: string) => void
    pauseTimer: (matchId: string) => void
    resumeTimer: (matchId: string) => void
    resetTimer: (matchId: string) => void
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

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function isMatchType(value: unknown): value is MatchTypes {
    return value === 'singles' || value === 'doubles'
}

function isMatchWinner(value: unknown): value is MatchWinner {
    return value === 'A' || value === 'B' || value === 'undefined'
}

function normalizePlayer(value: unknown): Player | null {
    if (!isRecord(value)) {
        return null
    }

    if (typeof value.id !== 'number' || !Number.isFinite(value.id)) {
        return null
    }

    if (typeof value.name !== 'string' || typeof value.level !== 'string') {
        return null
    }

    return {
        id: value.id,
        name: value.name,
        lastName: typeof value.lastName === 'string' ? value.lastName : '',
        level: value.level,
    }
}

function normalizePlayers(value: unknown) {
    if (!Array.isArray(value)) {
        return []
    }

    return value.flatMap((player) => {
        const normalizedPlayer = normalizePlayer(player)

        return normalizedPlayer ? [normalizedPlayer] : []
    })
}

function normalizeTeams(value: unknown): TeamPlayers {
    if (!isRecord(value)) {
        return { A: [], B: [] }
    }

    return {
        A: normalizePlayers(value.A),
        B: normalizePlayers(value.B),
    }
}

function normalizeMatchTimer(value: unknown): MatchTimerState | null {
    if (!isRecord(value)) {
        return null
    }

    if (value.status !== 'idle' && value.status !== 'running' && value.status !== 'paused') {
        return null
    }

    return {
        status: value.status,
        startedAt: typeof value.startedAt === 'number' ? value.startedAt : null,
        accumulatedMs: typeof value.accumulatedMs === 'number' ? value.accumulatedMs : 0,
    }
}

function normalizeMatchTimers(value: unknown): Record<string, MatchTimerState> {
    if (!isRecord(value)) {
        return {}
    }

    return Object.fromEntries(
        Object.entries(value).flatMap(([matchId, timer]) => {
            const normalizedTimer = normalizeMatchTimer(timer)

            return normalizedTimer ? [[matchId, normalizedTimer]] : []
        }),
    )
}

function normalizePlayingMatch(value: unknown, index: number): PlayingMatches | null {
    if (!isRecord(value) || !isRecord(value.teams)) {
        return null
    }

    const id = typeof value.id === 'string' ? value.id : typeof value.id === 'number' ? String(value.id) : ''

    if (!id) {
        return null
    }

    return {
        id,
        teams: normalizeTeams(value.teams),
        type: isMatchType(value.type) ? value.type : undefined,
        matchNumber: typeof value.matchNumber === 'number' ? value.matchNumber : index + 1,
        courtNumber: typeof value.courtNumber === 'string' ? value.courtNumber : '',
    }
}

function normalizePlayingMatches(value: unknown) {
    if (!Array.isArray(value)) {
        return []
    }

    return value.flatMap((match, index) => {
        const normalizedMatch = normalizePlayingMatch(match, index)

        return normalizedMatch ? [normalizedMatch] : []
    })
}

function normalizeEndedMatches(value: unknown): EndedMatch[] {
    if (!Array.isArray(value)) {
        return []
    }

    return value.flatMap((match, index) => {
        if (!isRecord(match)) {
            return []
        }

        const normalizedMatch = normalizePlayingMatch(match, index)

        if (!normalizedMatch) {
            return []
        }

        return [
            {
                ...normalizedMatch,
                duration: typeof match.duration === 'string' ? match.duration : '',
                scoreA: typeof match.scoreA === 'string' ? match.scoreA : '',
                scoreB: typeof match.scoreB === 'string' ? match.scoreB : '',
                winner: isMatchWinner(match.winner) ? match.winner : 'undefined',
            },
        ]
    })
}

function normalizePersistedState(persistedState: unknown, currentState: MatchArrangeStore): MatchArrangeStore {
    if (!isRecord(persistedState)) {
        return currentState
    }

    return {
        ...currentState,
        waitingList: Array.isArray(persistedState.waitingList)
            ? normalizePlayers(persistedState.waitingList)
            : currentState.waitingList,
        teams: isRecord(persistedState.teams) ? normalizeTeams(persistedState.teams) : currentState.teams,
        playingMatches: Array.isArray(persistedState.playingMatches)
            ? normalizePlayingMatches(persistedState.playingMatches)
            : currentState.playingMatches,
        endedMatches: Array.isArray(persistedState.endedMatches)
            ? normalizeEndedMatches(persistedState.endedMatches)
            : currentState.endedMatches,
        matchTimers: isRecord(persistedState.matchTimers)
            ? normalizeMatchTimers(persistedState.matchTimers)
            : currentState.matchTimers,
        matchTypes: isMatchType(persistedState.matchTypes) ? persistedState.matchTypes : currentState.matchTypes,
    }
}

function getPlayersFromTeams(teams: Partial<TeamPlayers> | undefined) {
    return [...(teams?.A ?? []), ...(teams?.B ?? [])]
}

function getNextPlayerId(state: MatchArrangeState) {
    const ids = [
        ...state.waitingList.map((player) => player.id),
        ...getPlayersFromTeams(state.teams).map((player) => player.id),
        ...state.playingMatches.flatMap((match) => getPlayersFromTeams(match.teams).map((player) => player.id)),
        ...state.endedMatches.flatMap((match) => getPlayersFromTeams(match.teams).map((player) => player.id)),
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
                        const lastName = player.lastName.trim() || ''
                        const level = player.level.trim()

                        if (!name || !level) {
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
                removePlayingMatch: (match: PlayingMatches) =>
                    set((state) => {
                        const { teams } = match

                        const remainingPlayingMatches = state.playingMatches.filter((m) => m.id !== match.id)

                        return {
                            ...state,
                            playingMatches: remainingPlayingMatches,
                            waitingList: [...state.waitingList, ...teams.A, ...teams.B],
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
                startMatch: (teamA: Player[], teamB: Player[], type: MatchTypes, courtNumber: string) =>
                    set((state) => {
                        // if()
                        const matchId = uuidv4()

                        const matchNumber = Math.max(0, state.playingMatches.length) + 1
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
                                    courtNumber,
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
                                    type: match.type,
                                    matchNumber: match.matchNumber,
                                    courtNumber: match.courtNumber,
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
                merge: normalizePersistedState,
                skipHydration: true,
            },
        ),
    )

export type BadmintonStoreApi = ReturnType<typeof createBadmintonStore>

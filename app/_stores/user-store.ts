import type { Sport } from '@/app/_utils/types'
import { createStore } from 'zustand'

export type AuthenticatedUser = {
    clerkUserId: string
    fullName: string | null
    userName: string | null
    email: string | null
    imageUrl: string | null
}

export type Session = {
    day: string
    startTime: string
    endTime: string
}

export type SessionStats = {
    avg: number
    latest: number
    sessionCount: number
}

export type PersistedUserProfile = {
    clubName: string | null
    email: string | null
    sports: Sport | null
    stats: {
        numPlayers: SessionStats
        numShuttles: SessionStats
    }
    schedule: Session[]
}

export type CurrentUser = AuthenticatedUser & PersistedUserProfile

type ClerkUserLike =
    | {
          id: string
          firstName: string | null
          lastName: string | null
          fullName?: string | null
          imageUrl?: string | null
          primaryEmailAddress?: {
              emailAddress: string
          } | null
      }
    | null
    | undefined

type DatabaseUserLike =
    | {
          userName?: string | null
          clubName?: string | null
          email?: string | null
          sports?: Sport | null
          stats?: {
              numPlayers?: SessionStats | null
              numShuttles?: SessionStats | null
          } | null
          schedule?: Session[] | null
      }
    | null
    | undefined

type UserState = {
    currentUser: CurrentUser | null
}

type UserActions = {
    clearCurrentUser: () => void
    setAuthenticatedUser: (currentUser: AuthenticatedUser | null) => void
    setCurrentUser: (currentUser: CurrentUser | null) => void
    setUserProfile: (profile: PersistedUserProfile) => void
    updateCurrentUser: (updates: Partial<CurrentUser>) => void
}

export type UserStore = UserState & UserActions
export type UserStoreState = Pick<UserStore, 'currentUser'>

export const defaultUserStoreState: UserStoreState = {
    currentUser: null,
}

export const defaultPersistedUserProfile: PersistedUserProfile = {
    clubName: null,
    email: null,
    sports: null,
    stats: {
        numPlayers: { avg: 0, latest: 0, sessionCount: 0 },
        numShuttles: { avg: 0, latest: 0, sessionCount: 0 },
    },
    schedule: [],
}

export function normalizeUserProfile(user: DatabaseUserLike): PersistedUserProfile {
    return {
        clubName: user?.clubName ?? null,
        email: user?.email ?? null,
        sports: user?.sports ?? null,
        stats: {
            numPlayers: {
                avg: user?.stats?.numPlayers?.avg ?? 0,
                latest: user?.stats?.numPlayers?.latest ?? 0,
                sessionCount: user?.stats?.numPlayers?.sessionCount ?? 0,
            },
            numShuttles: {
                avg: user?.stats?.numShuttles?.avg ?? 0,
                latest: user?.stats?.numShuttles?.latest ?? 0,
                sessionCount: user?.stats?.numShuttles?.sessionCount ?? 0,
            },
        },
        schedule: (user?.schedule ?? []).map((session) => ({
            day: session.day,
            startTime: session.startTime,
            endTime: session.endTime,
        })),
    }
}

export function normalizeAuthenticatedUser(user: ClerkUserLike): AuthenticatedUser | null {
    if (!user) {
        return null
    }

    const displayName = user.fullName ?? user.firstName ?? user.primaryEmailAddress?.emailAddress ?? null

    return {
        clerkUserId: user.id,
        fullName: user.fullName ?? null,
        userName: displayName,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user.imageUrl ?? null,
    }
}

export function mergeCurrentUser(
    authenticatedUser: ClerkUserLike,
    persistedUser: DatabaseUserLike,
): CurrentUser | null {
    const normalizedAuthenticatedUser = normalizeAuthenticatedUser(authenticatedUser)

    if (!normalizedAuthenticatedUser) {
        return null
    }

    return {
        ...normalizedAuthenticatedUser,
        ...normalizeUserProfile(persistedUser),
    }
}

export const createUserStore = (initState: UserStoreState = defaultUserStoreState) =>
    createStore<UserStore>()((set) => ({
        ...defaultUserStoreState,
        ...initState,
        setCurrentUser: (currentUser) => set({ currentUser }),
        setAuthenticatedUser: (currentUser) =>
            set((state) => ({
                currentUser: currentUser
                    ? {
                          ...defaultPersistedUserProfile,
                          ...(state.currentUser ?? {}),
                          ...currentUser,
                      }
                    : null,
            })),
        setUserProfile: (profile) =>
            set((state) => ({
                currentUser: state.currentUser
                    ? {
                          ...state.currentUser,
                          ...normalizeUserProfile(profile),
                      }
                    : null,
            })),
        updateCurrentUser: (updates) =>
            set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
            })),
        clearCurrentUser: () => set({ currentUser: null }),
    }))

export type UserStoreApi = ReturnType<typeof createUserStore>

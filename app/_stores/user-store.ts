import type { Sport } from '@/app/_utils/types'
import { createStore } from 'zustand'

export type AuthenticatedUser = {
    clerkUserId: string
    firstName: string | null
    lastName: string | null
    fullName: string | null
    username: string | null
    emailAddress: string | null
    imageUrl: string | null
    displayName: string | null
}

export type PersistedUserProfile = {
    userName: string | null
    clubName: string | null
    email: string | null
    sports: Sport | null
}

export type CurrentUser = AuthenticatedUser & PersistedUserProfile

type ClerkUserLike =
    | {
          id: string
          firstName: string | null
          lastName: string | null
          fullName?: string | null
          username?: string | null
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
    userName: null,
    clubName: null,
    email: null,
    sports: null,
}

export function normalizeUserProfile(user: DatabaseUserLike): PersistedUserProfile {
    return {
        userName: user?.userName ?? null,
        clubName: user?.clubName ?? null,
        email: user?.email ?? null,
        sports: user?.sports ?? null,
    }
}

export function normalizeAuthenticatedUser(user: ClerkUserLike): AuthenticatedUser | null {
    if (!user) {
        return null
    }

    const displayName =
        user.fullName ?? user.firstName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? null

    return {
        clerkUserId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName ?? null,
        username: user.username ?? null,
        emailAddress: user.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user.imageUrl ?? null,
        displayName,
    }
}

export function mergeCurrentUser(authenticatedUser: ClerkUserLike, persistedUser: DatabaseUserLike): CurrentUser | null {
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

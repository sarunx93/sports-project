'use client'

import { useUser } from '@clerk/nextjs'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'
import {
    createUserStore,
    defaultUserStoreState,
    normalizeAuthenticatedUser,
    type UserStore,
    type UserStoreApi,
    type UserStoreState,
} from '@/app/_stores/user-store'

const UserStoreContext = createContext<UserStoreApi | null>(null)

type UserStoreProviderProps = {
    children: ReactNode
    initialState?: UserStoreState
}

export function UserStoreProvider({ children, initialState = defaultUserStoreState }: UserStoreProviderProps) {
    const [store] = useState(() => createUserStore(initialState))
    const { isLoaded, isSignedIn, user } = useUser()

    useEffect(() => {
        if (!isLoaded) {
            return
        }

        if (!isSignedIn) {
            store.getState().clearCurrentUser()
            return
        }

        store.getState().setAuthenticatedUser(normalizeAuthenticatedUser(user))
    }, [isLoaded, isSignedIn, store, user])

    return <UserStoreContext.Provider value={store}>{children}</UserStoreContext.Provider>
}

export function useUserStore<T>(selector: (state: UserStore) => T) {
    const store = useContext(UserStoreContext)

    if (!store) {
        throw new Error('useUserStore must be used within UserStoreProvider')
    }

    return useStore(store, selector)
}

'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createBadmintonStore, type MatchArrangeStore, type BadmintonStoreApi } from '@/app/_stores/badminton-store'

const BadmintonStoreContext = createContext<BadmintonStoreApi | null>(null)

export function BadmintonStoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState(() => createBadmintonStore())
    return <BadmintonStoreContext.Provider value={store}>{children}</BadmintonStoreContext.Provider>
}

export function useBadmintonStore<T>(selector: (state: MatchArrangeStore) => T) {
    const store = useContext(BadmintonStoreContext)
    if (!store) throw new Error('useMatchArrangeStore must be used within MatchArrangeStoreProvider')
    return useStore(store, selector)
}

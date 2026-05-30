'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Player } from '@/app/_utils/sample-player'
import { useStore } from 'zustand'
import { createBadmintonStore, type MatchArrangeStore, type BadmintonStoreApi } from '@/app/_stores/badminton-store'

const BadmintonStoreContext = createContext<BadmintonStoreApi | null>(null)



export function BadmintonStoreProvider({
    children,
    initialWaitingList = [],
}: {
    children: ReactNode
    initialWaitingList?: Player[]
}) {
    const [store] = useState(() => createBadmintonStore(initialWaitingList))
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        let isMounted = true

        Promise.resolve(store.persist.rehydrate()).finally(() => {
            if (isMounted) {
                setHydrated(true)
            }
        })

        return () => {
            isMounted = false
        }
    }, [store])

    useEffect(() => {
        if (!hydrated) {
            return
        }

        // store.setState((state) => {
        //     const nextWaitingList = getSyncedWaitingList(initialWaitingList, state)

        //     if (arePlayersEqual(state.waitingList, nextWaitingList)) {
        //         return state
        //     }

        //     return {
        //         ...state,
        //         waitingList: nextWaitingList,
        //     }
        // })
    }, [hydrated, store])

    return <BadmintonStoreContext.Provider value={store}>{hydrated ? children : null}</BadmintonStoreContext.Provider>
}

export function useBadmintonStore<T>(selector: (state: MatchArrangeStore) => T) {
    const store = useContext(BadmintonStoreContext)
    if (!store) throw new Error('useMatchArrangeStore must be used within MatchArrangeStoreProvider')
    return useStore(store, selector)
}

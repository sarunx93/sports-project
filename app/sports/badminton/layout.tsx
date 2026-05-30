import { type ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import { getWaitingPlayers } from '@/app/_actions/badminton-actions'
import { BadmintonStoreProvider } from '@/app/_providers/badminton-store-provider'

export default async function BadmintonLayout({ children }: { children: ReactNode }) {
    const { userId } = await auth()
    const initialWaitingList = userId ? await getWaitingPlayers(userId) : []
    return <BadmintonStoreProvider initialWaitingList={initialWaitingList}>{children}</BadmintonStoreProvider>
}

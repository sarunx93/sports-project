import { type ReactNode } from 'react'
import { BadmintonStoreProvider } from '@/app/_providers/badminton-store-provider'

export default async function BadmintonLayout({ children }: { children: ReactNode }) {
    return <BadmintonStoreProvider>{children}</BadmintonStoreProvider>
}

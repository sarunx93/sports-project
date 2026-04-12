'use client'

import { useBadmintonStore } from '@/app/_providers/badminton-store-provider'
import Link from 'next/link'
import MatchSection from '@/app/_components/MatchSection'

const Page = () => {
    //get teams from match-arrange
    const playingMatches = useBadmintonStore((s) => s.playingMatches)

    //start the time
    return (
        <div className='h-full p-10'>
            <MatchSection playingMatches={playingMatches} />

            <Link href='/sports/badminton/match-arrange'>Go Back</Link>
        </div>
    )
}
export default Page

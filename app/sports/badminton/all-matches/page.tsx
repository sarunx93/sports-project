'use client'

import { useBadmintonStore } from '@/app/_providers/badminton-store-provider'
import Link from 'next/link'
import MatchSection from '@/app/_components/MatchSection'
import CardSection from '@/app/_components/CardSection'
import Card from '@/app/_components/Card'
import { buttonClasses } from '@/app/_components/Button'

const Page = () => {
    const playingMatches = useBadmintonStore((s) => s.playingMatches)

    return (
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
            <CardSection
                eyebrow='Live Matches'
                title='Track active badminton games.'
                description='Timers and score capture should stay visible while players rotate through matches.'
                actions={
                    <Link
                        href='/sports/badminton/match-arrange'
                        className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                        Back to arrangement
                    </Link>
                }>
                {playingMatches.length > 0 ? (
                    <MatchSection playingMatches={playingMatches} />
                ) : (
                    <Card tone='subtle' padding='lg' className='text-center'>
                        <h3 className='text-2xl font-semibold text-foreground'>No active matches yet.</h3>
                        <p className='mx-auto mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]'>
                            Start a match from the arrangement page and it will appear here with timer controls and
                            score entry.
                        </p>
                    </Card>
                )}
            </CardSection>
        </div>
    )
}
export default Page

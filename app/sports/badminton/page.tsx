import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import Card from '@/app/_components/Card'
import { buttonClasses } from '@/app/_components/Button'

const page = async () => {
    const user = await currentUser()

    if (!user) {
        return (
            <div className='mx-auto flex min-h-full max-w-3xl items-center px-4 py-12 sm:px-6'>
                <Card tone='brand' padding='lg' className='w-full text-center'>
                    <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>Badminton</p>
                    <h1 className='mt-4 text-4xl font-semibold tracking-tight text-foreground'>
                        Sign in to open the badminton desk.
                    </h1>
                    <p className='mt-4 text-base leading-7 text-(--muted)'>
                        The page is designed around club sessions, so the useful parts start once a player profile exists.
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
            <Card tone='brand' padding='lg' className='overflow-hidden'>
                <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
                    <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>
                            Welcome back
                        </p>
                        <h1 className='mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl'>
                            Build the next badminton session without hunting for controls.
                        </h1>
                        <p className='mt-4 max-w-2xl text-base leading-8 text-(--muted)'>
                            Start from the waiting list, balance two doubles teams, run the timer, and record the score in
                            the same workflow.
                        </p>

                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Link href='/sports/badminton/match-arrange' className={buttonClasses({ size: 'lg' })}>
                                Arrange a match
                            </Link>
                            <Link
                                href='/sports/badminton/all-matches'
                                className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
                                View live matches
                            </Link>
                        </div>
                    </div>

                    <div className='grid gap-4'>
                        <div className='rounded-[24px] border border-white/80 bg-white/82 p-5'>
                            <p className='text-sm font-medium text-[var(--foreground)]'>Player</p>
                            <p className='mt-2 text-2xl font-semibold text-[var(--foreground)]'>
                                {user.firstName ?? user.username ?? 'Club member'}
                            </p>
                            <p className='mt-1 text-sm text-[var(--muted)]'>Signed in and ready for session setup</p>
                        </div>
                        <div className='rounded-[24px] border border-white/80 bg-white/72 p-5'>
                            <p className='text-sm font-medium text-[var(--foreground)]'>Workflow</p>
                            <p className='mt-2 text-base leading-7 text-[var(--muted)]'>
                                Waiting list, team building, live timers, and score entry are already wired for badminton.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
export default page

import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import Card from '@/app/_components/Card'
import { buttonClasses } from '@/app/_components/Button'
import ProfleCard from '@/app/_components/ProfleCard'

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
                        The page is designed around club sessions, so the useful parts start once a player profile
                        exists.
                    </p>
                </Card>
            </div>
        )
    }

    return <ProfleCard />
}
export default page

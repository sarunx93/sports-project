import Link from 'next/link'
import Card from '@/app/_components/Card'
import { buttonClasses } from '@/app/_components/Button'

const page = () => {
    return (
        <div className='mx-auto flex min-h-full max-w-4xl items-center px-4 py-12 sm:px-6'>
            <Card tone='brand' padding='lg' className='w-full text-center'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>Tennis</p>
                <h1 className='mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]'>
                    This sport view is next in line.
                </h1>
                <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]'>
                    The route exists now, but the actual experience still needs a proper workflow. Badminton currently has
                    the strongest end-to-end interaction model.
                </p>
                <div className='mt-8 flex flex-wrap justify-center gap-3'>
                    <Link href='/sports/badminton' className={buttonClasses()}>
                        Open badminton
                    </Link>
                    <Link href='/' className={buttonClasses({ variant: 'secondary' })}>
                        Back home
                    </Link>
                </div>
            </Card>
        </div>
    )
}
export default page

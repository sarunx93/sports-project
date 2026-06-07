import Link from 'next/link'

import Card from './_components/Card'
import { buttonClasses } from './_components/Button'

const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/sports/badminton', label: 'Badminton desk' },
    { href: '/register', label: 'Club setup' },
]

export default function NotFound() {
    return (
        <div className='mx-auto flex min-h-full max-w-5xl items-center px-4 py-12 sm:px-6'>
            <Card tone='brand' padding='lg' className='w-full overflow-hidden'>
                <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center'>
                    <section>
                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>
                            Page not found
                        </p>
                        <h1 className='mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl'>
                            This match desk route is not on the schedule.
                        </h1>
                        <p className='mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]'>
                            The page may have moved, or the route may not exist yet. Head back to a working area and keep
                            the club session moving.
                        </p>

                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Link href='/' className={buttonClasses({ size: 'lg' })}>
                                Back home
                            </Link>
                            <Link href='/sports/badminton' className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
                                Open badminton
                            </Link>
                        </div>
                    </section>

                    <aside className='rounded-[28px] border border-white/80 bg-white/74 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)]'>
                        <div className='flex aspect-square items-center justify-center rounded-[24px] border border-dashed border-[var(--brand-border)] bg-[var(--surface)]'>
                            <p className='font-mono text-6xl font-semibold text-[var(--brand)]'>404</p>
                        </div>
                        <nav aria-label='Useful routes' className='mt-5 space-y-2'>
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className='flex min-h-11 items-center justify-between rounded-full border border-[var(--line)] bg-white/82 px-4 text-sm font-medium text-[var(--foreground)] transition hover:bg-white hover:text-[var(--brand)]'>
                                    {link.label}
                                    <span aria-hidden='true'>/</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>
                </div>
            </Card>
        </div>
    )
}

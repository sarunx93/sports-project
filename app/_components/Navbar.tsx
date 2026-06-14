'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useUserStore } from '../_providers/user-store-provider'
import { buttonClasses } from './Button'
import logo from '@/public/sports_logo.png'

const Navbar = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/sports/badminton', label: 'Badminton' },
        { href: '/sports/tennis', label: 'Tennis' },
        { href: '/sports/football', label: 'Football' },
        { href: '/register', label: 'Club Setup' },
    ]

    const preferredSportHref =
        currentUser?.sports === 'Badminton'
            ? '/sports/badminton'
            : currentUser?.sports === 'Tennis'
              ? '/sports/tennis'
              : '/register'

    return (
        <nav className='sticky top-0 z-50 border-b border-white/70 bg-[rgba(245,239,231,0.78)] backdrop-blur-xl'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6'>
                <div className='flex min-h-18 items-center justify-between gap-4'>
                    <Link href='/' className='flex items-center gap-3'>
                        <Image
                            src={logo}
                            alt={'app logo'}
                            className='flex h-15 w-15 items-center justify-center rounded-full'
                        />

                        <div>
                            <p className='text-lg font-semibold tracking-tight text-foreground'>Match Desk</p>
                            <p className='text-xs uppercase tracking-[0.22em] text-(--muted)'>Organize Neatly</p>
                        </div>
                    </Link>

                    <ul className='hidden items-center gap-2 md:flex'>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className='rounded-full px-4 py-2 text-sm font-medium text-(--muted) transition hover:bg-white/80 hover:text-foreground'>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className='flex items-center gap-3'>
                        {currentUser ? (
                            <>
                                <div className='hidden text-right md:block'>
                                    <p className='text-sm font-medium text-foreground'>{currentUser.displayName}</p>
                                    <p className='text-xs text-(--muted)'>
                                        {currentUser.clubName ? currentUser.clubName : 'No club set yet'}
                                    </p>
                                </div>
                                <UserButton />
                            </>
                        ) : (
                            <SignInButton mode='modal' forceRedirectUrl='/register'>
                                <button type='button' className={buttonClasses({ size: 'sm' })}>
                                    Sign in
                                </button>
                            </SignInButton>
                        )}
                    </div>
                </div>

                <div className='flex gap-2 overflow-x-auto pb-4 md:hidden'>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className='whitespace-nowrap rounded-full border border-white/70 bg-white/72 px-4 py-2 text-sm font-medium text-foreground shadow-[0_12px_35px_-28px_rgba(15,23,42,0.5)]'>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
export default Navbar

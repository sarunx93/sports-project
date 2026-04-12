'use client'

import Link from 'next/link'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useUserStore } from '../_providers/user-store-provider'

const Navbar = () => {
    const currentUser = useUserStore((state) => state.currentUser)

    return (
        <nav className='border-b border-gray-200 bg-white shadow-sm'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
                <Link href='/' className='text-xl font-bold text-gray-900'>
                    Logo
                </Link>

                {/* Desktop Menu */}
                <ul className='hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex'>
                    <li>
                        <Link href='/' className='transition hover:text-blue-600'>
                            Home
                        </Link>
                    </li>
                    {/* hover item */}
                    <li className='group relative'>
                        <Link href='' className='inline-flex items-center gap-1 transition hover:text-blue-600'>
                            Sports
                            <span className='text-xs'>▼</span>
                        </Link>
                        <div className='absolute left-0 top-full hidden pt-2 group-hover:block z-9999'>
                            <div className='min-w-45 rounded-lg border border-gray-100 bg-white py-2 shadow-lg'>
                                <Link href='/sports/badminton' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                    Badminton
                                </Link>
                                <Link href='/sports/tennis' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                    Tennis
                                </Link>
                                <Link href='/sports/soccer' className='block px-4 py-2 text-sm hover:bg-gray-100'>
                                    Soccer
                                </Link>
                            </div>
                        </div>
                    </li>
                    <li>
                        <Link href='/contact' className='transition hove:text-blue-600'>
                            Contact
                        </Link>
                    </li>
                </ul>

                <div className='flex items-center gap-3'>
                    {currentUser ? (
                        <>
                            <span className='hidden text-sm font-medium text-gray-700 md:block'>
                                {currentUser.displayName}
                            </span>
                            <UserButton />
                        </>
                    ) : (
                        <SignInButton mode='modal' forceRedirectUrl='/register'>
                            <button className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700'>
                                Sign in
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Navbar

import { auth } from '@clerk/nextjs/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Login from '../_components/Login'

type LoginPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const metadata: Metadata = {
    title: 'Sign in | Match Desk',
    description: 'Sign in or create your Match Desk account.',
}

function firstParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value
}

function safeRedirect(value: string | undefined) {
    if (!value) return '/sports/badminton'

    if (value.startsWith('/') && !value.startsWith('//')) {
        return value
    }

    try {
        const url = new URL(value)
        return `${url.pathname}${url.search}${url.hash}`
    } catch {
        return '/sports/badminton'
    }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams
    const mode = firstParam(params.mode) === 'register' ? 'register' : 'login'
    const redirectTo = safeRedirect(firstParam(params.redirect_url) ?? firstParam(params.redirectUrl))
    const { userId } = await auth()

    if (userId) {
        redirect(mode === 'register' && redirectTo === '/sports/badminton' ? '/register' : redirectTo)
    }

    return <Login initialMode={mode} redirectTo={redirectTo} />
}

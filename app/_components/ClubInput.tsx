'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, CreateUserState } from '../_actions/badminton-actions'
import { useUserStore } from '../_providers/user-store-provider'
import Card from './Card'
import Button from './Button'

const initialState: CreateUserState = {
    ok: false,
    message: '',
    userProfile: null,
    errors: {},
}

const ClubInput = () => {
    const [state, formAction, pending] = useActionState(createUser, initialState)
    const currentUser = useUserStore((store) => store.currentUser)
    const setUserProfile = useUserStore((store) => store.setUserProfile)
    const router = useRouter()
    const clubNameDefaultValue = state.ok ? '' : (currentUser?.clubName ?? '')
    const clubNameInputKey = state.ok ? 'cleared-club-name' : `club-name-${currentUser?.clubName ?? 'empty'}`
    const currentSportHref =
        currentUser?.sports === 'Badminton'
            ? '/sports/badminton'
            : currentUser?.sports === 'Tennis'
              ? '/sports/tennis'
              : '/'
    const inputClassName =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'

    useEffect(() => {
        if (state.ok && state.userProfile) {
            setUserProfile(state.userProfile)
        }
    }, [setUserProfile, state.ok, state.userProfile])

    useEffect(() => {
        if (currentUser?.clubName) {
            router.replace(currentSportHref)
        }
    }, [currentSportHref, currentUser?.clubName, router])

    return (
        <Card tone='default' padding='lg' className='mx-auto max-w-4xl'>
            <div className='mb-6'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>Club Setup</p>
                <h1 className='mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]'>
                    Create the club profile that powers your sports pages.
                </h1>
                <p className='mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]'>
                    Start with the club name and sport focus. The app can then route the user into the correct workspace.
                </p>
            </div>

            <div className='rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-5'>
                <p className='text-sm text-[var(--foreground)]'>Signed in as {currentUser?.displayName ?? 'there'}</p>
                {currentUser?.clubName ? (
                    <p className='mt-1 text-sm text-[var(--muted)]'>Existing club: {currentUser.clubName}</p>
                ) : null}
            </div>

            <form action={formAction} className='mt-6 grid gap-5 md:grid-cols-2'>
                <div className='md:col-span-2'>
                    <label htmlFor='club-name' className='text-sm font-medium text-[var(--foreground)]'>
                        Club name
                    </label>
                    <input
                        id='club-name'
                        key={clubNameInputKey}
                        type='text'
                        name='clubName'
                        className={inputClassName}
                        placeholder='Downtown Racquet Club'
                        defaultValue={clubNameDefaultValue}
                    />
                    {state.errors.clubName ? <p className='mt-2 text-sm text-[var(--danger)]'>{state.errors.clubName}</p> : null}
                </div>

                <div className='md:col-span-2'>
                    <label htmlFor='sports' className='text-sm font-medium text-[var(--foreground)]'>
                        Primary sport
                    </label>
                    <select
                        name='sports'
                        id='sports'
                        className={inputClassName}
                        defaultValue={currentUser?.sports ?? 'Badminton'}>
                        <option value='Badminton'>Badminton</option>
                        <option value='Tennis'>Tennis</option>
                        <option value='Football'>Football</option>
                    </select>
                    {state.errors.sports ? <p className='mt-2 text-sm text-[var(--danger)]'>{state.errors.sports}</p> : null}
                </div>

                <div className='md:col-span-2'>
                    <Button type='submit' fullWidth size='lg'>
                        {pending ? 'Submitting...' : 'Create your club'}
                    </Button>
                </div>

                {state.message ? (
                    <p className={`md:col-span-2 text-sm ${state.ok ? 'text-[var(--brand)]' : 'text-[var(--danger)]'}`}>
                        {state.message}
                    </p>
                ) : null}
            </form>
        </Card>
    )
}

export default ClubInput

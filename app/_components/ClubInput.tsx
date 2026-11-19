'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, CreateUserState } from '../_actions/badminton-actions'
import { useUserStore } from '../_providers/user-store-provider'
import Card from './Card'
import Button from './Button'
import { DAYS_OF_WEEK } from '../_utils/constant'

const initialState: CreateUserState = {
    ok: false,
    message: '',
    userProfile: null,
    errors: {},
}
type DayName = (typeof DAYS_OF_WEEK)[number]['en']['full']
type Session = {
    day: string
    startTime: string
    endTime: string
}

const ClubInput = () => {
    const [state, formAction, pending] = useActionState(createUser, initialState)
    const currentUser = useUserStore((store) => store.currentUser)
    const setUserProfile = useUserStore((store) => store.setUserProfile)
    const router = useRouter()
    const clubNameDefaultValue = state.ok ? '' : (currentUser?.clubName ?? '')
    const clubNameInputKey = state.ok ? 'cleared-club-name' : `club-name-${currentUser?.clubName ?? 'empty'}`
    const [schedule, setSchedule] = useState<Session[]>([])

    //set day
    const toggleDay = (day: string) => {
        setSchedule((prev) =>
            prev.some((item) => item.day === day)
                ? prev.filter((item) => item.day !== day)
                : [...prev, { day, startTime: '', endTime: '' }],
        )
    }

    //set time
    const setStartTime = (day: string, startTime: string) => {
        setSchedule((prev) => prev.map((item) => (item.day === day ? { ...item, startTime } : item)))
    }
    const setEndTime = (day: string, endTime: string) => {
        setSchedule((prev) => prev.map((item) => (item.day === day ? { ...item, endTime } : item)))
    }

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
                    Start with the club name and sport focus. The app can then route the user into the correct
                    workspace.
                </p>
            </div>

            <div className='rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-5'>
                <p className='text-sm text-[var(--foreground)]'>Signed in as {currentUser?.userName ?? 'there'}</p>
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
                    {state.errors.clubName ? (
                        <p className='mt-2 text-sm text-[var(--danger)]'>{state.errors.clubName}</p>
                    ) : null}
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
                    {state.errors.sports ? (
                        <p className='mt-2 text-sm text-[var(--danger)]'>{state.errors.sports}</p>
                    ) : null}
                </div>
                <div className='md:col-span-2'>
                    <label htmlFor='days' className='text-sm font-medium text-[var(--foreground)]'>
                        Session day(s) เลือกได้มากกว่า 1 วัน
                    </label>
                    <div className={`flex justify-around mt-3`}>
                        {DAYS_OF_WEEK.map((day, i) => {
                            return (
                                <Button
                                    variant={
                                        schedule.map((item) => item.day).includes(day.en.full) ? 'selected' : 'primary'
                                    }
                                    key={i}
                                    onClick={() => toggleDay(day.en.full)}>
                                    {day.en.short}
                                </Button>
                            )
                        })}
                    </div>
                    {Object.hasOwn(schedule[0] || {}, 'day') &&
                        schedule.map((item, i) => {
                            return (
                                <div className='md:flex my-6' key={i}>
                                    <h3 className='mr-3'>{item.day}</h3>
                                    <div>
                                        <label htmlFor={`start-time-${item.day}`}>เวลาเริ่ม</label>
                                        <input
                                            id='start-time'
                                            type='time'
                                            name='start-time'
                                            onChange={(e) => {
                                                setStartTime(item.day, e.target.value)
                                            }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`end-time-${item.day}`}>เวลาจบ</label>
                                        <input
                                            id='end-time'
                                            type='time'
                                            name='end-time'
                                            onChange={(e) => {
                                                setEndTime(item.day, e.target.value)
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className='md:col-span-2'>
                    <Button type='submit' fullWidth size='lg'>
                        {pending ? 'Submitting...' : 'Create your club'}
                    </Button>
                </div>

                {state.message ? (
                    <p className={`md:col-span-2 text-sm ${state.ok ? 'text-(--brand)' : 'text-(--danger)'}`}>
                        {state.message}
                    </p>
                ) : null}
                <input type='hidden' name='schedule' value={JSON.stringify(schedule)} />
            </form>
        </Card>
    )
}

export default ClubInput

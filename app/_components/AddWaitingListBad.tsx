'use client'

import { useState, type FormEvent } from 'react'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import Card from './Card'
import Button from './Button'

const AddWaitingListBad = () => {
    const addPlayerToWaitingList = useBadmintonStore((s) => s.addPlayerToWaitingList)

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [level, setLevel] = useState('')

    const inputStyle =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'

    const handleWaitingList = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmedName = name.trim()
        const trimmedLastName = lastName.trim()
        const trimmedLevel = level.trim()

        if (!trimmedName || !trimmedLastName || !trimmedLevel) return

        addPlayerToWaitingList({
            name: trimmedName,
            lastName: trimmedLastName,
            level: trimmedLevel,
        })
        setName('')
        setLastName('')
        setLevel('')
    }

    return (
        <Card tone='default' padding='md'>
            <div className='mb-5'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>Add Player</p>
                <h2 className='mt-3 text-2xl font-semibold text-[var(--foreground)]'>Populate the waiting list.</h2>
                <p className='mt-2 text-sm leading-7 text-[var(--muted)]'>
                    New players appear in the waiting list instantly and can be placed into either team.
                </p>
            </div>

            <form onSubmit={handleWaitingList} className='space-y-4'>
                <div>
                    <label htmlFor='player-name' className='text-sm font-medium text-[var(--foreground)]'>
                        First name
                    </label>
                    <input
                        id='player-name'
                        type='text'
                        className={inputStyle}
                        placeholder='Alex'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='player-last-name' className='text-sm font-medium text-[var(--foreground)]'>
                        Last name
                    </label>
                    <input
                        id='player-last-name'
                        type='text'
                        className={inputStyle}
                        placeholder='Tan'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='player-level' className='text-sm font-medium text-[var(--foreground)]'>
                        Skill level
                    </label>
                    <select
                        name=''
                        id='player-level'
                        onChange={(e) => setLevel(e.target.value)}
                        value={level}
                        className='block'>
                        <option value='nb'>NB</option>
                        <option value='bg'>BG</option>
                        <option value='n'>N</option>
                        <option value='s'>S</option>
                        <option value='p'>P</option>
                        <option value='c'>C</option>
                    </select>
                </div>
                <Button type='submit' fullWidth>
                    Add to waiting list
                </Button>
            </form>
        </Card>
    )
}

export default AddWaitingListBad

'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import Card from './Card'
import Button from './Button'
import Input from './Input'

const AddWaitingListBad = () => {
    const addPlayerToWaitingList = useBadmintonStore((s) => s.addPlayerToWaitingList)

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [level, setLevel] = useState('nb')
    const [warning, setWarning] = useState({
        firstNameWarning: '',
    })
    const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const inputStyle =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'

    useEffect(() => {
        return () => {
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current)
            }
        }
    }, [])

    const handleWaitingList = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmedName = name.trim()
        const trimmedLastName = lastName.trim()
        const trimmedLevel = level.trim()

        if (!trimmedName || !trimmedLevel) {
            setWarning({ firstNameWarning: 'กรุณาใส่ชื่อผู้เล่น' })
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current)
            }

            warningTimeoutRef.current = setTimeout(() => {
                setWarning({ ...warning, firstNameWarning: '' })
                warningTimeoutRef.current = null
            }, 2000)
            return
        }

        addPlayerToWaitingList({
            name: trimmedName,
            lastName: trimmedLastName || '',
            level: trimmedLevel,
        })
        setName('')
        setLastName('')
        setLevel('nb')
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
                    <Input
                        label='First Name'
                        id='player-name'
                        placeholder='first name'
                        value={name}
                        warning={warning.firstNameWarning}
                        onChangeHandler={setName}
                    />
                </div>
                <div>
                    <Input
                        label='Last Name'
                        id='player-last-name'
                        placeholder='last name'
                        value={lastName}
                        onChangeHandler={setLastName}
                    />
                </div>
                <div>
                    <label htmlFor='player-level' className='text-sm font-medium text-foreground'>
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

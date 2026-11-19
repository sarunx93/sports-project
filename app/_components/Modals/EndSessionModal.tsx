'use client'

import { useState } from 'react'
import Button from '../Button'
import { recodeSession } from '@/app/_actions/badminton-actions'
import { z } from 'zod'

const sessionSchema = z.object({
    numPlayers: z
        .string()
        .trim()
        .regex(/^\d+$/, 'กรุณาระบุจำนวนผู้เล่น')
        .transform(Number)
        .pipe(z.number().int().min(1, 'At least 1 player is required')),
    numShuttles: z
        .string()
        .trim()
        .regex(/^\d+$/, 'กรุณาระบุจำนวนลูกขนได่')
        .transform(Number)
        .pipe(z.number().int().min(1, 'Shuttles cannot be negative')),
})

type EndSessionModalProps = {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onCancel: () => void
}

export default function EndSessionModal({
    title = 'Confirm the result',
    message = 'Enter game scores separated by commas, for example 21,18 or 21,19,21.',
    confirmText = 'Save result',
    cancelText = 'Cancel',
    onCancel,
    setIsOpen,
}: EndSessionModalProps) {
    const inputStyle =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'

    const [numPlayers, setNumPlayers] = useState('')
    const [numShuttles, setNumShuttles] = useState('')
    const [errors, setErrors] = useState<{
        numPlayers?: string[]
        numShuttles?: string[]
    }>({})

    const handleSubmit = async () => {
        // validate nums
        const result = sessionSchema.safeParse({ numPlayers, numShuttles })
        console.log(result)

        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors)
            return
        }

        await recodeSession(Number(numPlayers), Number(numShuttles))
        setNumPlayers('')
        setNumShuttles('')
        setIsOpen(false)
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,32,51,0.48)] px-4 backdrop-blur-sm'>
            <div className='w-full max-w-md rounded-[28px] border border-white/70 bg-(--surface-strong) p-6 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.55)]'>
                <h2 className='text-xl font-semibold text-foreground'>{title}</h2>
                <p className='mt-2 text-sm leading-7 text-(--muted)'>{message}</p>

                <div className='mt-5'>
                    <label htmlFor='num-shuttles' className='text-sm font-medium text-foreground'>
                        จำนวนลูกที่ใช้
                    </label>
                    <input
                        id='num-shuttles'
                        type='text'
                        className={inputStyle}
                        value={numShuttles}
                        onChange={(e) => {
                            setNumShuttles(e.target.value)
                        }}
                    />
                    {errors.numShuttles && <p className='mt-2 text-sm text-(--danger)'>{errors.numShuttles[0]}</p>}
                </div>

                <div className='mt-4'>
                    <label htmlFor='team-b-score' className='text-sm font-medium text-foreground'>
                        จำนวนผู้เล่น
                    </label>
                    <input
                        id='team-b-score'
                        type='text'
                        className={inputStyle}
                        value={numPlayers}
                        onChange={(e) => {
                            setNumPlayers(e.target.value)
                        }}
                    />
                    {errors.numPlayers && <p className='mt-2 text-sm text-(--danger)'>{errors.numPlayers[0]}</p>}
                </div>

                <div className='mt-6 flex justify-end gap-3'>
                    <Button onClick={onCancel} variant='ghost' className='border border-(--line) bg-white/75'>
                        {cancelText}
                    </Button>
                    <Button onClick={handleSubmit}>{confirmText}</Button>
                </div>

                {/* <p className='mt-4 text-sm text-(--danger)'>{generalMessage}</p> */}
            </div>
        </div>
    )
}

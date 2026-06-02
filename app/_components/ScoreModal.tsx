'use client'

import { useState } from 'react'
import { validateBadmintonMatch, type ValidatedBadmintonMatch } from '../_utils/badminton-score'
import Button from './Button'
import ConfirmModal from './Modal'

type ScoreModalModalProps = {
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    onSetA: (scoreA: string) => void
    onSetB: (scoreB: string) => void
    onConfirm: (result: ValidatedBadmintonMatch) => void
    onCancel: () => void
    scoreA: string
    scoreB: string
}

export default function ScoreModal({
    isOpen,
    title = 'Confirm the result',
    message = 'Enter game scores separated by commas, for example 21,18 or 21,19,21.',
    confirmText = 'Save result',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    onSetA,
    onSetB,
    scoreA,
    scoreB,
}: ScoreModalModalProps) {
    const inputStyle =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'

    const [scoreAMessage, setScoreAMessage] = useState<string>('')
    const [scoreBMessage, setScoreBMessage] = useState<string>('')
    const [generalMessage, setGeneralMessage] = useState<string>('')
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)

    function clearMessages() {
        setScoreAMessage('')
        setScoreBMessage('')
        setGeneralMessage('')
    }

    function validateScore() {
        if (!scoreA && !scoreB) {
            setIsConfirmOpen(true)
            return
        }
        const validation = validateBadmintonMatch(scoreA, scoreB)

        if (!validation.ok) {
            setScoreAMessage(validation.errors.scoreA ?? '')
            setScoreBMessage(validation.errors.scoreB ?? '')
            setGeneralMessage(validation.errors.general ?? '')
            return
        }

        clearMessages()
        onConfirm(validation)
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,32,51,0.48)] px-4 backdrop-blur-sm'>
            <div className='w-full max-w-md rounded-[28px] border border-white/70 bg-(--surface-strong) p-6 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.55)]'>
                <h2 className='text-xl font-semibold text-foreground'>{title}</h2>
                <p className='mt-2 text-sm leading-7 text-(--muted)'>{message}</p>

                <div className='mt-5'>
                    <label htmlFor='team-a-score' className='text-sm font-medium text-foreground'>
                        Team A score
                    </label>
                    <input
                        id='team-a-score'
                        type='text'
                        className={inputStyle}
                        value={scoreA}
                        onChange={(e) => {
                            setScoreAMessage('')
                            setGeneralMessage('')
                            onSetA(e.target.value)
                        }}
                    />
                    <p className='mt-2 text-sm text-[var(--danger)]'>{scoreAMessage}</p>
                </div>

                <div className='mt-4'>
                    <label htmlFor='team-b-score' className='text-sm font-medium text-[var(--foreground)]'>
                        Team B score
                    </label>
                    <input
                        id='team-b-score'
                        type='text'
                        className={inputStyle}
                        value={scoreB}
                        onChange={(e) => {
                            setScoreBMessage('')
                            setGeneralMessage('')
                            onSetB(e.target.value)
                        }}
                    />
                    <p className='mt-2 text-sm text-[var(--danger)]'>{scoreBMessage}</p>
                </div>

                <div className='mt-6 flex justify-end gap-3'>
                    <Button onClick={onCancel} variant='ghost' className='border border-[var(--line)] bg-white/75'>
                        {cancelText}
                    </Button>
                    <Button onClick={validateScore}>{confirmText}</Button>
                </div>

                <p className='mt-4 text-sm text-[var(--danger)]'>{generalMessage}</p>
            </div>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onConfirm={onConfirm}
                onCancel={() => {
                    setIsConfirmOpen(false)
                }}
            />
        </div>
    )
}

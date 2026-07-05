'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_MATCH_TIMER_STATE, getElapsedMatchTimerMs, type PlayingMatches } from '../_stores/badminton-store'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import { recordMatch } from '../_actions/badminton-actions'
import ScoreModal from './ScoreModal'
import type { ValidatedBadmintonMatch } from '../_utils/badminton-score'
import Button from './Button'

type TimerProps = {
    match: PlayingMatches
}

const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const Timer = ({ match }: TimerProps) => {
    const endMatch = useBadmintonStore((s) => s.endMatch)
    const timer = useBadmintonStore((s) => s.matchTimers[match.id] ?? DEFAULT_MATCH_TIMER_STATE)
    const startTimer = useBadmintonStore((s) => s.startTimer)
    const pauseTimer = useBadmintonStore((s) => s.pauseTimer)
    const resumeTimer = useBadmintonStore((s) => s.resumeTimer)
    const resetTimer = useBadmintonStore((s) => s.resetTimer)

    const [, setTick] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [scoreA, setScoreA] = useState('')
    const [scoreB, setScoreB] = useState('')

    const elapsedTime = Math.floor(getElapsedMatchTimerMs(timer) / 1000)

    const handleStart = () => {
        if (timer.status === 'running') return
        startTimer(match.id)
    }

    const handlePause = () => {
        pauseTimer(match.id)
    }

    const handleResume = () => {
        if (timer.status !== 'paused') return
        resumeTimer(match.id)
    }

    const handleReset = () => {
        resetTimer(match.id)
        setSaveMessage(null)
    }

    const handleFinish = async (validatedMatch?: ValidatedBadmintonMatch) => {
        if (isSaving) return

        const duration = formatTime(elapsedTime)

        setIsSaving(true)
        setSaveMessage(null)

        const result = await recordMatch({
            ...match,
            duration,
            scoreA: validatedMatch?.scoreA ?? '',
            scoreB: validatedMatch?.scoreB ?? '',
            winner: validatedMatch?.winner || 'undefined',
        })
        if (!result.ok) {
            setIsSaving(false)
            setSaveMessage(result.message)
            return
        }

        endMatch(match, {
            duration,
            scoreA: validatedMatch?.scoreA ?? '',
            scoreB: validatedMatch?.scoreB ?? '',
            winner: validatedMatch?.winner || 'undefined',
        })
        setScoreA('')
        setScoreB('')
        setIsModalOpen(false)
        setIsSaving(false)
    }

    useEffect(() => {
        if (timer.status !== 'running') {
            return
        }

        const intervalId = window.setInterval(() => {
            setTick((t) => t + 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [timer.startedAt, timer.status])

    const statusLabel =
        timer.status === 'idle' ? 'Not started' : timer.status === 'running' ? 'Match running' : 'Paused'

    return (
        <div className='rounded-3xl border border-(--line) bg-(--surface) p-5 w-85'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)'>Timer</p>
                    <div className='mt-2 text-4xl font-semibold tabular-nums text-foreground'>
                        {formatTime(elapsedTime)}
                    </div>
                </div>
                <span className='rounded-full bg-white/88 px-3 py-1 text-xs font-medium text-foreground'>
                    {statusLabel}
                </span>
            </div>

            <div className='mt-4 flex flex-wrap gap-3'>
                {timer.status === 'idle' && (
                    <Button onClick={handleStart} className='w-full'>
                        Start
                    </Button>
                )}
                {timer.status === 'running' && (
                    <>
                        <Button variant='secondary' className='bg-emerald-600 blac' onClick={handlePause}>
                            Pause
                        </Button>
                        <Button variant='secondary' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button
                            disabled={isSaving}
                            onClick={() => setIsModalOpen(true)}
                            variant='secondary'
                            className='bg-foreground black'>
                            {isSaving ? 'Saving...' : 'Finish'}
                        </Button>
                    </>
                )}
                {timer.status === 'paused' && (
                    <>
                        <Button
                            variant='secondary'
                            className='bg-emerald-600 black cursor-pointer'
                            onClick={handleResume}>
                            Resume
                        </Button>
                        <Button variant='ghost' className='border border-(--line) bg-white/72' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button disabled={isSaving} onClick={() => setIsModalOpen(true)}>
                            {isSaving ? 'Saving...' : 'Finish'}
                        </Button>
                    </>
                )}
            </div>

            {saveMessage ? <p className='mt-4 text-sm text-(--muted)'>{saveMessage}</p> : null}

            <ScoreModal
                isOpen={isModalOpen}
                onSetA={setScoreA}
                onSetB={setScoreB}
                onConfirm={handleFinish}
                onCancel={() => setIsModalOpen(false)}
                scoreA={scoreA}
                scoreB={scoreB}
            />
        </div>
    )
}

export default Timer

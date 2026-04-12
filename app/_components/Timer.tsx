'use client'
import { useEffect, useRef, useState } from 'react'
import { PlayingMatches } from '../_stores/badminton-store'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import { recordMatch } from '../_actions/badminton-actions'

type Status = 'idle' | 'running' | 'paused'

type TimerProps = {
    match: PlayingMatches
}

const Timer = ({ match }: TimerProps) => {
    const endMatch = useBadmintonStore((s) => s.endMatch)

    const [status, setStatus] = useState<Status>('idle')
    const [elapsedTime, setElapsedTime] = useState<number>(0)
    const [startedAt, setStartedAt] = useState<number | null>(null)
    const [accumulatedTime, setAccumulatedTime] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    const intervalRef = useRef<number | null>(null)

    const clearTimer = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const run = () => {
        const start = Date.now()
        setStartedAt(start)
        setStatus('running')

        intervalRef.current = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - start) / 1000)
            setElapsedTime(accumulatedTime + elapsed)
        }, 1000)
    }

    const handleStart = () => {
        if (status === 'running') return
        run()
    }

    const handlePause = () => {
        if (status !== 'running' || startedAt === null) return

        // eslint-disable-next-line react-hooks/purity
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        const total = accumulatedTime + elapsed

        clearTimer()
        setAccumulatedTime(total)
        setElapsedTime(total)
        setStatus('paused')
    }

    const handleResume = () => {
        if (status !== 'paused') return
        run()
    }

    const handleReset = () => {
        clearTimer()
        setStatus('idle')
        setElapsedTime(0)
        setAccumulatedTime(0)
        setStartedAt(null)
        setSaveMessage(null)
    }
    const handleFinish = async () => {
        if (isSaving) return

        const duration = formatTime(elapsedTime)

        setIsSaving(true)
        setSaveMessage(null)

        const result = await recordMatch({ ...match, duration })

        if (!result.ok) {
            setIsSaving(false)
            setSaveMessage(result.message)
            return
        }

        endMatch(match, duration)
        clearTimer()
        setElapsedTime(0)
        setAccumulatedTime(0)
        setStartedAt(null)
        setStatus('idle')
        setIsSaving(false)
        setSaveMessage(result.message)
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

    useEffect(() => {
        return () => clearTimer()
    }, [])

    return (
        <div>
            <div className='mt-4 text-3xl font-bold tabular-nums'>{formatTime(elapsedTime)}</div>
            {/* <div className='mt-2 text-sm text-gray-500'>
                Status: <span className='font-medium'>{status}</span>
            </div> */}
            <div className='mt-2 flex gap-3'>
                {status === 'idle' && (
                    <button onClick={handleStart} className='bg-blue-600 text-white px-4 py-1 rounded-lg'>
                        Start
                    </button>
                )}
                {status === 'running' && (
                    <button onClick={handlePause} className='bg-amber-500 text-white px-4 py-1 rounded-lg'>
                        Pause
                    </button>
                )}
                {status === 'paused' && (
                    <button onClick={handleResume} className='bg-green-500 text-white px-4 py-1 rounded-lg'>
                        Resume
                    </button>
                )}
                <button onClick={handleReset} className='border px-4 py-1 rounded-lg'>
                    Reset
                </button>
                <button
                    disabled={isSaving}
                    onClick={handleFinish}
                    className='bg-emerald-600 text-white border px-4 py-1 rounded-lg disabled:cursor-not-allowed disabled:bg-emerald-300'>
                    {isSaving ? 'Saving...' : 'Finish'}
                </button>
            </div>

            {saveMessage ? <p className='mt-3 text-sm text-slate-600'>{saveMessage}</p> : null}
        </div>
    )
}
export default Timer

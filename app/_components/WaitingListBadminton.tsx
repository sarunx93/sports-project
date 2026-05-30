'use client'

import { useState } from 'react'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import PlayerListCard from './PlayerListCard'
import ConfirmModal from './Modal'
import Card from './Card'
import Button from './Button'

const WaitingListBadminton = () => {
    const waitingList = useBadmintonStore((s) => s.waitingList)
    const addPlayerToTeam = useBadmintonStore((s) => s.addPlayerToTeam)
    const removePlayerFromWaitingList = useBadmintonStore((s) => s.removePlayerFromWaitingList)
    const removeAllPlayersFromWaitingList = useBadmintonStore((s) => s.removeAllPlayersFromWaitingList)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleConfirm = () => {
        removeAllPlayersFromWaitingList()
        setIsModalOpen(false)
    }

    return (
        <Card tone='default' padding='md' className='flex max-h-120 flex-col'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>Queue</p>
                    <h2 className='mt-3 text-2xl font-semibold text-[var(--foreground)]'>Waiting list</h2>
                </div>
                <span className='rounded-full bg-[var(--brand-surface)] px-3 py-1 text-xs font-medium text-[var(--foreground)]'>
                    {waitingList.length} players
                </span>
            </div>

            <div className='mt-5 flex-1 min-h-0 overflow-y-auto pr-2'>
                <div className='flex min-h-52 flex-col gap-3'>
                    {waitingList.length > 0 ? (
                        waitingList.map((player) => (
                            <PlayerListCard
                                key={player.id}
                                player={player}
                                handleClickAdd={() => addPlayerToTeam(player)}
                                handleClickRemove={() => removePlayerFromWaitingList(player)}
                            />
                        ))
                    ) : (
                        <div className='flex min-h-52 items-center justify-center rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-6 text-center text-sm leading-7 text-[var(--muted)]'>
                            No players are waiting right now. Add someone first, then place them into Team A or Team B.
                        </div>
                    )}
                </div>
            </div>

            {waitingList.length > 0 ? (
                <Button variant='danger' fullWidth className='mt-5' onClick={openModal}>
                    Clear waiting list
                </Button>
            ) : null}

            {isModalOpen ? <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={closeModal} /> : null}
        </Card>
    )
}

export default WaitingListBadminton

'use client'

import { useDraggable } from '@dnd-kit/react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { type Player } from '../_utils/sample-player'

type TeamName = 'A' | 'B'

type DraggablePlayerCardProps = {
    player: Player
    team: TeamName
    slotIndex: number
    onRemove: () => void
}

type PlayerCardProps = {
    player: Player
    onRemove?: () => void
}

function DraggablePlayerCard({ player, team, slotIndex, onRemove }: DraggablePlayerCardProps) {
    const { ref } = useDraggable({
        id: `player:${player.id}`,
        data: {
            playerId: player.id,
            team,
            slotIndex,
        },
    })

    return (
        <div
            className='group flex w-full items-center gap-3 rounded-[22px] border border-white/80 bg-white/88 p-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)]'
            ref={ref}>
            <div className='cursor-grab select-none text-lg leading-none text-[var(--muted)] transition group-hover:text-[var(--foreground)]'>
                ⋮⋮
            </div>
            <PlayerCard player={player} onRemove={onRemove} />
        </div>
    )
}
export const PlayerCard = ({ player, onRemove }: PlayerCardProps) => {
    return (
        <div className='flex flex-1 items-center justify-between gap-4'>
            <div className='flex min-w-0 items-center gap-3'>
                <div className='min-w-0'>
                    <p className='truncate text-lg font-semibold text-[var(--foreground)]'>
                        {player.name} {player.lastName.charAt(0).toUpperCase()}.
                    </p>
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                        <span className='rounded-full bg-[var(--surface)] text-xs font-medium text-[var(--foreground)]'>
                            Level {player.level.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
            {onRemove ? (
                <button
                    className='flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[rgba(220,38,38,0.12)] hover:text-[var(--danger)]'
                    onClick={onRemove}
                    title='Remove from match'>
                    <FaRegTrashAlt />
                </button>
            ) : (
                <span className='rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]'>
                    Ready
                </span>
            )}
        </div>
    )
}

export default DraggablePlayerCard

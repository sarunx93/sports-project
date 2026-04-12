'use client'

import { useDraggable } from '@dnd-kit/react'
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
        <div className='flex w-full items-center justify-between gap-4 p-3 bg-slate-50 rounded-lg shadow-sm' ref={ref}>
            <PlayerCard player={player} onRemove={onRemove} />
        </div>
    )
}

export const PlayerCard = ({ player, onRemove }: PlayerCardProps) => {
    return (
        <>
            <div className='flex items-center gap-3'>
                <div className='cursor-grab text-gray-400'>⋮⋮</div>
                <div className='w-8 h-8 flex items-center justify-center rounded-md bg-blue-500 text-white text-sm font-bold'>
                    {player.name[0].toUpperCase()}
                </div>
                <div>
                    <p className='font-medium text-2xl'>
                        {player.name} {player.lastName[0] + '.'}
                    </p>
                    <p className='text-md text-gray-500'>Level {player.level}</p>
                </div>
            </div>
            <button className='text-gray-400 hover:text-red-500' onClick={onRemove}>
                🗑
            </button>
        </>
    )
}
export default DraggablePlayerCard

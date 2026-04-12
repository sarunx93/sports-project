'use client'

import DraggablePlayerCard from '@/app/_components/PlayerCard'
import { type Player } from '@/app/_utils/sample-player'
import { DragDropProvider, useDroppable } from '@dnd-kit/react'
import PlayerListCard from '@/app/_components/PlayerListCard'
import { useBadmintonStore } from '@/app/_providers/badminton-store-provider'
import { type ComponentProps } from 'react'
import Link from 'next/link'

type TeamName = 'A' | 'B'

type DragLocation = {
    team: TeamName
    slotIndex: number
}

type DragEndHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragEnd']>

type DroppablePlayerSlotProps = {
    player: Player
    team: TeamName
    slotIndex: number
    onRemove: () => void
}

function DroppablePlayerSlot({ player, team, slotIndex, onRemove }: DroppablePlayerSlotProps) {
    const { ref, isDropTarget } = useDroppable({
        id: `slot:${team}:${slotIndex}`,
        data: {
            team,
            slotIndex,
        },
    })

    return (
        <div
            ref={ref}
            className={`w-full rounded-lg transition ${isDropTarget ? 'ring-2 ring-slate-700 ring-offset-2' : ''}`}>
            <DraggablePlayerCard player={player} team={team} slotIndex={slotIndex} onRemove={onRemove} />
        </div>
    )
}

const Page = () => {
    const waitingList = useBadmintonStore((s) => s.waitingList)
    const teamA = useBadmintonStore((s) => s.teams.A)
    const teamB = useBadmintonStore((s) => s.teams.B)

    const addPlayerToTeam = useBadmintonStore((s) => s.addPlayerToTeam)
    const swapPlayers = useBadmintonStore((s) => s.swapPlayers)
    const removePlayerFromMatch = useBadmintonStore((s) => s.removePlayerFromMatch)
    const startMatch = useBadmintonStore((s) => s.startMatch)

    const handleDragEnd: DragEndHandler = (event) => {
        const source = event.operation.source
        const target = event.operation.target

        if (!target) return

        const sourceData = source?.data as DragLocation | undefined
        const targetData = target?.data as DragLocation | undefined

        if (!sourceData || !targetData) return
        swapPlayers(sourceData, targetData)
    }

    return (
        <div className='h-full bg-slate-50 p-6'>
            <div className='mx-auto flex h-full max-w-7xl gap-6 min-h-0'>
                <div className='w-1/3'>
                    <div className='flex h-full min-h-0 flex-col gap-4 rounded-xl bg-white p-4 drop-shadow-lg'>
                        <h2 className='text-xl font-semibold'>Waiting List</h2>
                        {/* Player List */}

                        <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto'>
                            {/* use data to render here */}
                            {waitingList.map((player) => (
                                <PlayerListCard
                                    key={player.id}
                                    player={player}
                                    handleClick={() => addPlayerToTeam(player)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                    <DragDropProvider onDragEnd={handleDragEnd}>
                        <div className='bg-white rounded-xl drop-shadow-lg p-4 flex flex-col gap-4'>
                            <h2 className='text-xl font-semibold'>Match Arrangement</h2>
                            {/* Teams */}
                            <div className='flex flex-col gap-6'>
                                {/* Team A */}
                                <div className='flex flex-col gap-3 bg-emerald-300 p-4 rounded-xl drop-shadow-lg'>
                                    <h3 className='font-semibold'>Team A</h3>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {teamA?.map((player, index) => (
                                            <DroppablePlayerSlot
                                                key={player.id}
                                                player={player}
                                                team='A'
                                                slotIndex={index}
                                                onRemove={() => removePlayerFromMatch(player)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {/* Team B */}
                                <div className='flex flex-col gap-3 bg-amber-300 p-4 rounded-xl drop-shadow-lg'>
                                    <h3 className='font-semibold'>Team B</h3>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {teamB?.map((player, index) => (
                                            <DroppablePlayerSlot
                                                key={player.id}
                                                player={player}
                                                team='B'
                                                slotIndex={index}
                                                onRemove={() => removePlayerFromMatch(player)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <button
                                    className='bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-400'
                                    onClick={() => startMatch(teamA, teamB)}>
                                    ▶ Start Match
                                </button>
                            </div>
                        </div>
                    </DragDropProvider>
                    <div className='flex justify-center mt-8'>
                        <button className=' cursor-pointer bg-emerald-600 px-6 py-3 rounded-lg text-white hover:bg-emerald-500'>
                            <Link href='/sports/badminton/all-matches'>See All Matches</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page

'use client'

import DraggablePlayerCard from '@/app/_components/PlayerCard'
import { type Player } from '@/app/_utils/constants'
import { DragDropProvider, useDroppable } from '@dnd-kit/react'
import { useBadmintonStore } from '@/app/_providers/badminton-store-provider'
import { useState, type ComponentProps } from 'react'
import Link from 'next/link'
import WaitingListBadminton from '@/app/_components/WaitingListBadminton'
import AddWaitingListBad from '@/app/_components/AddWaitingListBad'
import Card from '@/app/_components/Card'
import CardSection from '@/app/_components/CardSection'
import { buttonClasses } from '@/app/_components/Button'
import Button from '@/app/_components/Button'

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
    const matchType = useBadmintonStore((s) => s.matchTypes)

    const swapPlayers = useBadmintonStore((s) => s.swapPlayers)
    const removePlayerFromMatch = useBadmintonStore((s) => s.removePlayerFromMatch)
    const startMatch = useBadmintonStore((s) => s.startMatch)
    const setMatchType = useBadmintonStore((s) => s.setMatchType)
    const isMatchReady = teamA.length && teamB.length

    const [isSingles, setIsSingles] = useState<boolean>(false)

    const handleToggle = () => {
        setIsSingles((prev) => !prev)
        setMatchType(isSingles ? 'singles' : 'doubles')
    }

    function getTeamLength() {
        if (matchType === 'singles') {
            return '1'
        } else {
            return '2'
        }
    }

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
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
            <CardSection
                eyebrow='Badminton Workspace'
                title='Build the next doubles match.'
                description='Use the waiting list on the left, place players into teams, and start the match once both sides are full.'
                actions={
                    <Link
                        href='/sports/badminton/all-matches'
                        className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                        See all matches
                    </Link>
                }>
                {/* <div className='grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]'> */}
                <div>
                    <div className='grid grid-cols-2 gap-6 justify-center mb-4'>
                        <AddWaitingListBad />
                        <WaitingListBadminton />
                    </div>

                    <Card tone='default' padding='lg' className='min-h-128'>
                        <div className='mb-6 flex flex-col gap-4 rounded-3xl border border-dashed border-(--line) bg-(--surface) p-5 lg:flex-row lg:items-center lg:justify-between'>
                            <div>
                                <p className='text-sm font-medium text-foreground'>Current setup</p>

                                <p className='mt-1 text-sm text-(--muted)'>
                                    {waitingList.length} waiting, {teamA.length + teamB.length} placed into teams
                                </p>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                <div>
                                    <Button onClick={handleToggle} className='mr-3.5'>
                                        {matchType === 'doubles' ? 'Doubles' : 'Singles'}
                                    </Button>
                                </div>

                                <div className='flex items-center'>
                                    <span className='rounded-full bg-(--success-surface) px-3 py-1 text-xs font-medium text-foreground'>
                                        Team A: {teamA.length}/{getTeamLength()}
                                    </span>
                                    <span className='rounded-full bg-(--warning-surface) px-3 py-1 text-xs font-medium text-foreground'>
                                        Team B: {teamB.length}/{getTeamLength()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <DragDropProvider onDragEnd={handleDragEnd}>
                            <div className='grid gap-6 xl:grid-cols-2'>
                                {[
                                    {
                                        team: 'A' as const,
                                        title: 'Team A',
                                        tone: 'success' as const,
                                        players: teamA,
                                    },
                                    {
                                        team: 'B' as const,
                                        title: 'Team B',
                                        tone: 'warning' as const,
                                        players: teamB,
                                    },
                                ].map((team) => (
                                    <Card key={team.team} tone={team.tone} padding='md' className='h-full'>
                                        <div className='flex items-center justify-between gap-4'>
                                            <div>
                                                <h3 className='text-xl font-semibold text-foreground'>{team.title}</h3>
                                                <p className='mt-1 text-sm text-(--muted)'>
                                                    Drag placed players to swap positions.
                                                </p>
                                            </div>
                                            <span className='rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs font-medium text-foreground'>
                                                {team.players.length}/{matchType === 'doubles' ? '2' : '1'} players
                                            </span>
                                        </div>

                                        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                                            {Array.from({ length: matchType === 'doubles' ? 2 : 1 }, (_, index) => {
                                                const player = team.players[index]

                                                if (!player) {
                                                    return (
                                                        <div
                                                            key={`${team.team}-empty-${index}`}
                                                            className='flex min-h-32 items-center justify-center rounded-[22px] border border-dashed border-[var(--line)] bg-white/55 p-5 text-center text-sm leading-6 text-[var(--muted)]'>
                                                            Add a player from the waiting list
                                                        </div>
                                                    )
                                                }

                                                return (
                                                    <DroppablePlayerSlot
                                                        key={player.id}
                                                        player={player}
                                                        team={team.team}
                                                        slotIndex={index}
                                                        onRemove={() => removePlayerFromMatch(player)}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </DragDropProvider>

                        <div className='mt-8 flex flex-col gap-4 rounded-[24px] border border-white/80 bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between'>
                            <div>
                                <p className='text-lg font-semibold text-[var(--foreground)]'>
                                    {isMatchReady ? 'Ready to start the match.' : 'Each team needs two players.'}
                                </p>
                                <p className='mt-1 text-sm text-[var(--muted)]'>
                                    The start action stays disabled until the match is fully staffed.
                                </p>
                            </div>
                            <button
                                className={buttonClasses({
                                    size: 'lg',
                                    className: !isMatchReady ? 'pointer-events-none' : 'cursor-pointer',
                                })}
                                disabled={!isMatchReady}
                                onClick={() => startMatch(teamA, teamB, matchType)}>
                                Start Match
                            </button>
                        </div>
                    </Card>
                </div>
            </CardSection>
        </div>
    )
}
export default Page

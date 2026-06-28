import { type PlayingMatches } from '../_stores/badminton-store'
import { PlayerCard } from './PlayerCard'
import Timer from './Timer'
import Card from './Card'
import { useBadmintonStore } from '../_providers/badminton-store-provider'
import Button from './Button'
type MatchSectionProps = {
    playingMatches: PlayingMatches[]
}

const MatchSection = ({ playingMatches }: MatchSectionProps) => {
    const removePlayingMatch = useBadmintonStore((s) => s.removePlayingMatch)

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            {playingMatches.map((match) => {
                const matchType = match.type ?? 'doubles'

                return (
                    <Card key={match.id} tone='default' padding='lg' className='overflow-hidden'>
                        <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                            <div>
                                <div className='flex flex-col gap-0.5 mb-2'>
                                    <h2 className='text-2xl font-semibold uppercase tracking-[0.24em] text-brand'>
                                        Match {match.matchNumber}
                                    </h2>
                                    <h3 className='mt-3 text-xl font-semibold text-foreground'>
                                        {matchType.toUpperCase()}
                                    </h3>
                                    <h3>Court {match.courtNumber}</h3>
                                </div>

                                <Button
                                    className='cursor-pointer'
                                    variant='danger'
                                    onClick={() => removePlayingMatch(match)}>
                                    Remove
                                </Button>
                            </div>
                            <Timer match={match} key={match.id} />
                        </div>

                        <div className='mt-6 grid gap-5 xl:grid-cols-2'>
                            <Card tone='success' padding='md'>
                                <h4 className='text-xl font-semibold text-foreground'>Team A</h4>
                                <div className={`mt-4 grid grid-cols-1 gap-4`}>
                                    {match.teams.A.map((player) => (
                                        <div
                                            key={player.id}
                                            className='rounded-[22px] border border-white/75 bg-white/82 p-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'>
                                            <PlayerCard player={player} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card tone='warning' padding='md'>
                                <h4 className='text-xl font-semibold text-foreground'>Team B</h4>
                                <div className={`mt-4 grid grid-cols-1 gap-4`}>
                                    {match.teams.B.map((player) => (
                                        <div
                                            key={player.id}
                                            className='rounded-[22px] border border-white/75 bg-white/82 p-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'>
                                            <PlayerCard player={player} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}

export default MatchSection

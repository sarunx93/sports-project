import { type PlayingMatches } from '../_stores/badminton-store'
import { PlayerCard } from './PlayerCard'
import Timer from './Timer'

type MatchSectionProps = {
    playingMatches: PlayingMatches[]
}

const MatchSection = ({ playingMatches }: MatchSectionProps) => {
    return (
        <>
            {playingMatches.map((match) => {
                return (
                    <div
                        className='bg-white rounded-xl drop-shadow-lg p-4 flex flex-col gap-4 w-5xl m-auto mb-7'
                        key={match.id}>
                        <div className='flex justify-between'>
                            <h1>Match: {match.id}</h1>
                            <Timer match={match} />
                        </div>

                        <div className='flex flex-col gap-6'>
                            {/* Team A */}
                            <div className='flex flex-col gap-3 bg-emerald-300 p-4 rounded-xl drop-shadow-lg'>
                                <h3 className='font-semibold'>Team A</h3>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {match.teams.A.map((player) => (
                                        <div
                                            key={player.id}
                                            className='flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3 shadow-sm'>
                                            <PlayerCard player={player} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* TeamB */}
                            <div className='flex flex-col gap-3 bg-amber-300 p-4 rounded-xl drop-shadow-lg'>
                                <h3 className='font-semibold'>Team B</h3>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {match.teams.B.map((player) => (
                                        <div
                                            key={player.id}
                                            className='flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3 shadow-sm'>
                                            <PlayerCard player={player} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
export default MatchSection

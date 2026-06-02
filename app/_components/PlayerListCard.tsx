import { FaRegPlusSquare, FaRegTrashAlt } from 'react-icons/fa'
import { type Player } from '../_utils/constants'

type Props = {
    player: Player
    handleClickAdd: () => void
    handleClickRemove: () => void
}

const PlayerListCard = ({ player, handleClickAdd, handleClickRemove }: Props) => {
    return (
        <div className='flex items-center justify-between gap-4 rounded-[22px] border border-[var(--line)] bg-white/78 p-4 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.38)]'>
            <div className='flex min-w-0 items-center gap-3'>
                <div className='mr-1 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-semibold text-white'>
                    {player.name.charAt(0).toUpperCase()}
                </div>
                <div className='min-w-0'>
                    <p className='truncate text-lg font-semibold text-[var(--foreground)]'>
                        {player.name} {player.lastName.charAt(0).toUpperCase()}.
                    </p>
                    <p className='mt-2 text-sm text-[var(--muted)]'>Level {player.level.toUpperCase()}</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <button
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success-surface)] text-[var(--foreground)] transition hover:scale-[1.02] hover:bg-[rgba(16,185,129,0.24)]'
                    onClick={handleClickAdd}
                    title='Add to team'>
                    <FaRegPlusSquare />
                </button>
                <button
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(220,38,38,0.1)] text-[var(--danger)] transition hover:scale-[1.02] hover:bg-[rgba(220,38,38,0.16)]'
                    onClick={handleClickRemove}
                    title='Remove player'>
                    <FaRegTrashAlt />
                </button>
            </div>
        </div>
    )
}

export default PlayerListCard

import { FaRegPlusSquare, FaRegTrashAlt } from 'react-icons/fa'

import { type Player } from '../_utils/sample-player'

type Props = {
    player: Player
    handleClick: () => void
}

const PlayerListCard = ({ player, handleClick }: Props) => {
    return (
        <div className='flex items-stretch justify-between p-3 rounded-lg border'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 flex items-center justify-center rounded-md bg-purple-500 text-white text-sm font-bold mr-2'>
                    {player.name[0].toUpperCase()}
                </div>
                <div>
                    <p className='font-medium text-2xl'>
                        {player.name} {player.lastName[0]}
                    </p>
                    <p className='text-md text-gray-500'>Level {player.level}</p>
                </div>
            </div>
            <div className='flex self-stretch flex-col justify-between py-1'>
                <button className='block text-xl cursor-pointer my-1' onClick={handleClick}>
                    <FaRegPlusSquare />
                </button>
                <button className='block text-xl cursor-pointer my-1'>
                    <FaRegTrashAlt />
                </button>
            </div>
        </div>
    )
}
export default PlayerListCard

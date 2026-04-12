'use client'
import { useActionState, useEffect } from 'react'
import { createUser, CreateUserState } from '../_actions/badminton-actions'
import { useUserStore } from '../_providers/user-store-provider'

// type ClubInputProps = {
//     userName: string
// }

const initialState: CreateUserState = {
    ok: false,
    message: '',
    userProfile: null,
    errors: {},
}

const ClubInput = () => {
    const [state, formAction, pending] = useActionState(createUser, initialState) //it lets a client component submit to a server action.
    const currentUser = useUserStore((store) => store.currentUser)
    const setUserProfile = useUserStore((store) => store.setUserProfile)

    useEffect(() => {
        if (state.ok && state.userProfile) {
            setUserProfile(state.userProfile)
        }
    }, [setUserProfile, state.ok, state.userProfile])

    return (
        <div className='bg-white rounded-xl drop-shadow-lg p-4 flex flex-col gap-4 w-5xl m-auto mb-7'>
            <h3>{currentUser?.clubName ? 'have club' : 'no club'}</h3>
            <div className='text-gray-700'>Hello {currentUser?.displayName ?? 'there'}</div>
            {currentUser?.clubName ? <div className='text-sm text-gray-500'>Club: {currentUser.clubName}</div> : null}
            <form action={formAction}>
                <input
                    type='text'
                    name='clubName'
                    className='border rounded p-1'
                    defaultValue={currentUser?.clubName ?? ''}
                />
                {state.errors.clubName ? <p className='mt-1 text-sm text-red-600'>{state.errors.clubName}</p> : null}
                <select name='sports' id='sports' defaultValue={currentUser?.sports ?? 'Badminton'}>
                    <option value='Badminton'>Badminton</option>
                    <option value='Tennis'>Tennis</option>
                    <option value='Football'>Football</option>
                </select>
                {state.errors.sports ? <p className='mt-1 text-sm text-red-600'>{state.errors.sports}</p> : null}
                <button className='block cursor-pointer bg-emerald-600 px-6 py-3 rounded-lg text-white hover:bg-emerald-500 w-3xs m-auto'>
                    {pending ? 'Submitting...' : 'Create your club'}
                </button>
                {state.message ? (
                    <p className={`mt-2 text-sm ${state.ok ? 'text-emerald-600' : 'text-red-600'}`}>{state.message}</p>
                ) : null}
            </form>
        </div>
    )
}
export default ClubInput

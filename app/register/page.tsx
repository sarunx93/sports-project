import ClubProfileForm from '../_components/ClubProfileForm'
import { createUser, getUser } from '../_actions/badminton-actions'
import { redirect } from 'next/navigation'
const Register = async () => {
    const profile = await getUser()
    // const redirecLink = profile?.sports.toLowerCase()
    // if (profile) {
    //     redirect(`/sports/${redirecLink}`)
    // }
    return (
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
            <ClubProfileForm
                mode={'create'}
                initialValues={{
                    clubName: '',
                    sports: 'Badminton',
                    schedule: [],
                }}
                action={createUser}
            />
        </div>
    )
}
export default Register

import { redirect } from 'next/navigation'
import { getUser, updateUserProfile } from '../_actions/badminton-actions'
import ClubProfileForm from '../_components/ClubProfileForm'

const Page = async () => {
    const profile = await getUser()
    if (!profile) {
        redirect('/register')
    }

    return (
        <div>
            <ClubProfileForm
                mode='edit'
                initialValues={{
                    clubName: profile.clubName,
                    sports: profile.sports,
                    schedule: profile.schedule,
                }}
                action={updateUserProfile}
            />
        </div>
    )
}
export default Page

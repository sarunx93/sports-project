'use client'

import { SignOutButton } from '@clerk/nextjs'

const SignOutBtn = () => {
    return (
        <SignOutButton redirectUrl='/'>
            <button>logout</button>
        </SignOutButton>
    )
}
export default SignOutBtn

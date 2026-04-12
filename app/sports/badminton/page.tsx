import React from 'react'
import { currentUser, auth } from '@clerk/nextjs/server'
const page = async () => {
    const user = await currentUser()
    const authen = await auth()
    console.log('current user', user)
    console.log('authen', authen)
    return <h1>Badminton</h1>
}
export default page

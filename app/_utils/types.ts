export type Sport = 'Badminton' | 'Tennis' | 'Football'

export type User = {
    userName: string
    clerkUserId: string
    clubName: string
    email: string | null
    sports: Sport
    matches: []
}

export type CreateUserInput = {
    userName: string
    clubName: string
    sports: Sport
}

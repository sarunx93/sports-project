import badmintonIcon from '@/public/badminton_icon.png'
import tennisIcon from '@/public/tennis_icon.png'
import soccerIcon from '@/public/soccer_icon.png'

export type Player = {
    id: number
    name: string
    lastName: string
    level: string
}

export const sports = [
    {
        name: 'Badminton',
        description:
            'Waiting list management, team arrangement, timers, and score capture are already part of the flow.',
        href: '/sports/badminton',
        img: badmintonIcon,
        cta: 'Manage your club',
        tone: 'success' as const,
        features: ['Waiting list', 'Drag to swap', 'Match history'],
    },
    {
        name: 'Tennis',
        description:
            'The page exists, but the experience still needs match-specific tools and a stronger presentation layer.',
        href: '/sports/tennis',
        img: tennisIcon,
        cta: 'Manage your club',
        tone: 'brand' as const,
        features: ['Court schedule', 'Singles or doubles', 'Result tracking'],
    },
    {
        name: 'Football',
        description: 'Keep this visible as a future module, but don’t treat it like a fully shipped section yet.',
        href: '',
        img: soccerIcon,
        cta: 'Coming soon',
        tone: 'warning' as const,
        features: ['Squad board', 'Fixtures', 'League stats'],
    },
]

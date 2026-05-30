import Link from 'next/link'
import Card from './Card'
import CardSection from './CardSection'
import { buttonClasses } from './Button'

const sports = [
    {
        name: 'Badminton',
        state: 'Available now',
        description: 'Waiting list management, team arrangement, timers, and score capture are already part of the flow.',
        href: '/sports/badminton',
        cta: 'Open badminton',
        tone: 'success' as const,
        features: ['Waiting list', 'Drag to swap', 'Match history'],
    },
    {
        name: 'Tennis',
        state: 'Designing next',
        description: 'The page exists, but the experience still needs match-specific tools and a stronger presentation layer.',
        href: '/sports/tennis',
        cta: 'Preview tennis',
        tone: 'brand' as const,
        features: ['Court schedule', 'Singles or doubles', 'Result tracking'],
    },
    {
        name: 'Football',
        state: 'Planned',
        description: 'Keep this visible as a future module, but don’t treat it like a fully shipped section yet.',
        href: '',
        cta: 'Coming soon',
        tone: 'warning' as const,
        features: ['Squad board', 'Fixtures', 'League stats'],
    },
]

const platformHighlights = [
    {
        title: 'One club identity',
        description: 'Guide a user from sign-in to club setup without dumping them into an empty page.',
    },
    {
        title: 'Fast match control',
        description: 'The badminton flow is the strongest product story, so surface it earlier and style it like the flagship.',
    },
    {
        title: 'Clear progression',
        description: 'Show which sports are live, which are in progress, and which are only placeholders.',
    },
]

const SportListHome = () => {
    return (
        <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-14'>
            <CardSection
                eyebrow='Sports Overview'
                title='Make the homepage feel like a product surface, not a placeholder.'
                description='Each sport should communicate its current maturity level and give the user a clear next step.'>
                <div className='grid gap-5 lg:grid-cols-3'>
                    {sports.map((sport) => (
                        <Card key={sport.name} tone={sport.tone} padding='lg' className='flex h-full flex-col gap-6'>
                            <div className='space-y-4'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div>
                                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]'>
                                            {sport.state}
                                        </p>
                                        <h3 className='mt-3 text-2xl font-semibold text-[var(--foreground)]'>
                                            {sport.name}
                                        </h3>
                                    </div>
                                    <span className='rounded-full border border-white/75 bg-white/70 px-3 py-1 text-xs font-medium text-[var(--foreground)]'>
                                        {sport.features.length} focus areas
                                    </span>
                                </div>
                                <p className='text-sm leading-7 text-[var(--muted)]'>{sport.description}</p>
                            </div>

                            <div className='flex flex-wrap gap-2'>
                                {sport.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className='rounded-full border border-white/80 bg-white/68 px-3 py-1 text-xs font-medium text-[var(--foreground)]'>
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className='mt-auto'>
                                {sport.href ? (
                                    <Link href={sport.href} className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
                                        {sport.cta}
                                    </Link>
                                ) : (
                                    <span
                                        className={buttonClasses({
                                            variant: 'ghost',
                                            fullWidth: true,
                                            className: 'pointer-events-none border border-dashed border-[var(--line)]',
                                        })}>
                                        {sport.cta}
                                    </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </CardSection>

            <div className='mt-10 grid gap-5 md:grid-cols-3'>
                {platformHighlights.map((item) => (
                    <Card key={item.title} tone='subtle' padding='md' className='h-full'>
                        <h3 className='text-lg font-semibold text-[var(--foreground)]'>{item.title}</h3>
                        <p className='mt-3 text-sm leading-7 text-[var(--muted)]'>{item.description}</p>
                    </Card>
                ))}
            </div>
        </section>
    )
}
export default SportListHome

import Link from 'next/link'
import Card from './Card'
import CardSection from './CardSection'
import { buttonClasses } from './Button'
import { sports } from '../_utils/constants'
import Image from 'next/image'

const SportListHome = () => {
    return (
        <section className='sport-list mx-auto px-8 py-8 sm:px-6 md:py-14 bg-(--surface)'>
            <CardSection
                className='p-20'
                eyebrow='Sports Overview'
                title='Make the homepage feel like a product surface, not a placeholder.'
                description='Each sport should communicate its current maturity level and give the user a clear next step.'>
                <div className='grid gap-5 lg:grid-cols-3 p-'>
                    {sports.map((sport) => (
                        <Card
                            key={sport.name}
                            tone={sport.tone}
                            padding='lg'
                            className='flex h-full flex-col gap-6'
                            isAnimated={true}>
                            <div className='space-y-4'>
                                <div className='md:flex items-center gap-3'>
                                    <Image src={sport.img} alt='image' height={150} />
                                    <h3 className='text-3xl font-semibold text-foreground'>{sport.name}</h3>
                                </div>
                                <p className='text-sm leading-7 text-(--muted)'>{sport.description}</p>
                            </div>

                            <div className='flex flex-wrap gap-2'>
                                {sport.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className='rounded-full border border-white/80 bg-white/68 px-3 py-1 text-xs font-medium text-foreground'>
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className='mt-auto'>
                                {sport.href ? (
                                    <Link
                                        href={sport.href}
                                        className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
                                        {sport.cta}
                                    </Link>
                                ) : (
                                    <span
                                        className={buttonClasses({
                                            variant: 'ghost',
                                            fullWidth: true,
                                            className: 'pointer-events-none border border-dashed border-(--line)',
                                        })}>
                                        {sport.cta}
                                    </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </CardSection>
        </section>
    )
}
export default SportListHome

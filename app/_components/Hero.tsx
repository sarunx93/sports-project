import Link from 'next/link'
import Image from 'next/image'

import Card from './Card'
import { buttonClasses } from './Button'

import hero from '@/public/hero_image.png'
import badmintonIcon from '@/public/badminton_icon.png'
import tennisIcon from '@/public/tennis_icon.png'
import soccerIcon from '@/public/soccer_icon.png'

const highlights = ['Sign up', 'Organize', 'Play']

const Hero = () => {
    return (
        <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16'>
            <div className='grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]'>
                <div className='space-y-6'>
                    <div className='inline-flex items-center rounded-full border border-(--brand-border) bg-(--brand-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>
                        Try Some Animation
                    </div>
                    <div className='space-y-4'>
                        <h1 className='max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl'>
                            Neatly Organized
                        </h1>
                        <p className='max-w-2xl text-lg leading-8 text-(--muted)'>
                            Match Desk is your personal sport management assistant. Organize neatly, play delightfully.
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-3'>
                        {/* <Link href='/sports/badminton' className={buttonClasses({ size: 'lg' })}>
                            Explore Badminton
                        </Link> */}
                        <Link href='/register' className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
                            Set Up Your Club
                        </Link>
                    </div>

                    {/* <div className='grid gap-3 sm:grid-cols-3'>
                        {highlights.map((highlight) => (
                            <Card key={highlight} tone='success' padding='md' className='flex h-full flex-col gap-4'>
                                <p className='text-sm font-medium leading-6 text-foreground'>{highlight}</p>
                            </Card>
                        ))}
                    </div> */}
                </div>

                <div className='relative'>
                    <div className='absolute inset-x-8 -top-6 h-24 rounded-full bg-[rgba(15,118,110,0.16)] blur-3xl' />
                    <Card tone='subtle' padding='sm' className='relative overflow-hidden'>
                        <div className='relative h-80 overflow-hidden rounded-3xl md:h-136'>
                            <Image src={hero} alt='Sports hero image' fill className='object-cover' priority />
                            <div className='absolute inset-0 bg-gradient-to-t from-[rgba(18,32,51,0.68)] via-transparent to-transparent' />
                        </div>

                        {/* <div className='absolute inset-x-8 bottom-8'>
                            <div className='rounded-3xl border border-white/20 bg-[rgba(18,32,51,0.72)] p-5 text-white backdrop-blur-sm'>
                                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-white/70'>
                                    Match Session
                                </p>
                                <div className='mt-3 grid gap-3 sm:grid-cols-3'>
                                    <div>
                                        <p className='text-2xl font-semibold'>3</p>
                                        <p className='text-sm text-white/70'>Sport hubs planned</p>
                                    </div>
                                    <div>
                                        <p className='text-2xl font-semibold'>1</p>
                                        <p className='text-sm text-white/70'>Live workflow shipping now</p>
                                    </div>
                                    <div>
                                        <p className='text-2xl font-semibold'>4</p>
                                        <p className='text-sm text-white/70'>Players per doubles match</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </Card>
                </div>
            </div>
        </section>
    )
}
export default Hero

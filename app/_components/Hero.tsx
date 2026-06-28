'use client'
import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import Card from './Card'
import { buttonClasses } from './Button'

import hero from '@/public/hero_image.png'
import { useInView } from '../hooks/useInView'

const sportsHighlight = [
    { icon: '🏸', label: 'Badminton' },
    { icon: '🎾', label: 'Tennis' },
    { icon: '⚽️', label: 'Football' },
]

const Hero = () => {
    const [highlightIndex, setHighlightIndex] = useState(0)
    const currentHighlight = sportsHighlight[highlightIndex]
    const { ref, isInView } = useInView()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHighlightIndex((index) => (index + 1) % sportsHighlight.length)
        }, 20000)
        return () => window.clearInterval(intervalId)
    }, [])

    return (
        <section
            className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 card ${isInView ? 'show' : ''}`}
            ref={ref}
            style={{
                transitionDelay: `${1000}ms`,
            }}>
            <div className='grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]'>
                <div className='space-y-6'>
                    <div className='inline-flex items-center rounded-full border border-(--brand-border) bg-(--brand-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>
                        <h4 className='inline-flex items-center gap-2 text-2xl'>
                            <span key={currentHighlight.label} className='sport-highlight-icon' aria-hidden='true'>
                                {currentHighlight.icon}
                            </span>
                            <span>{currentHighlight.label}</span>
                        </h4>
                    </div>
                    <div className='space-y-4'>
                        <h1 className='max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl'>
                            Manage Your Club !!
                        </h1>
                        <p className='max-w-2xl text-lg leading-8 text-(--muted)'>
                            Manage your 3 beloved sports for all Thais. Run smoothly, play delightly.
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-3'>
                        <Link
                            href='/register'
                            className={buttonClasses({
                                variant: 'secondary',
                                size: 'lg',
                            })}>
                            Create your club
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
                            <div className='absolute inset-0 bg-linear-to-t from-[rgba(18,32,51,0.68)] via-transparent to-transparent' />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
export default Hero

'use client'
import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'

import Link from 'next/link'
import Image from 'next/image'

import Card from './Card'
import Button, { buttonClasses } from './Button'

import hero from '@/public/hero_image.png'
import { useInView } from '../hooks/useInView'
import gsap from 'gsap'
import { ScrollTrigger, SplitText } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger, SplitText)

const HeroSlide = () => {
    const heroRef = useRef<HTMLElement>(null)

    useGSAP(
        () => {
            const q = gsap.utils.selector(heroRef)
            const heroSection = heroRef.current
            const heroContainer = q('.hero-container')[0]

            if (!heroSection || !heroContainer) return

            const titleSplit = SplitText.create(q('.hero-title'), {
                type: 'chars',
            })
            const tl = gsap.timeline({
                delay: 1,
            })

            tl.to(q('.hero-content'), {
                opacity: 1,
                y: 0,
                ease: 'power1.inOut',
            })
                .from(
                    titleSplit.chars,
                    {
                        yPercent: 200,
                        stagger: 0.02,
                        ease: 'power2.out',
                    },
                    '-=0.5',
                )
                .to(
                    q('.hero-text-scroll'),
                    {
                        duration: 1,
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        ease: 'circ.out',
                    },
                    '-=0.5',
                )

                .fromTo(
                    q('.hero-button'),
                    {
                        y: 80,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                        clearProps: 'transform',
                    },
                    '-=0.2',
                )
        },
        { scope: heroRef, dependencies: [] },
    )

    return (
        <section ref={heroRef} className='bg-main-bg'>
            <div className='hero-container'>
                <div className='overlay'></div>
                <Image src='/hero-bg.png' alt='' className='absolute bottom-40 size-full object-cover' fill />
                <div className='hero-content'>
                    <div className='overflow-hidden mb-2'>
                        <h1 className='hero-title'>Let&apos;s Play</h1>
                    </div>
                    <div
                        className='hero-text-scroll'
                        style={{
                            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
                        }}>
                        <div className='hero-subtitle'>
                            <h1>like a pro</h1>
                        </div>
                    </div>
                    <div>
                        <Link
                            href='/register'
                            className={buttonClasses({
                                variant: 'secondary',
                                size: 'lg',
                                className:
                                    'hero-button border-0 bg-light-brown text-dark-brown md:mt-16 mt-10 md:px-16 px-10 hover:bg-milk',
                            })}>
                            <p className='uppercase font-bold text-lg '>Create your club</p>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroSlide

import Image from 'next/image'
import hero from '@/public/hero_image.png'
const Hero = () => {
    return (
        <section className='mx-auto px-20 py-10 md:py-16 '>
            <div className='grid items-center gap-10 lg:grid-cols-2'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-[0.2em] text-teal-600'>Live Sports</p>
                    <h1 className='mt-4 text-4xl font-bold text-gray-900 md:text-5xl'>Follow the games that matter.</h1>
                    <p className='mt-4 max-w-xl text-lg text-gray-600'>
                        Scores, schedules, and sport-specific pages in one place.
                    </p>
                </div>

                <div className='relative h-80 overflow-hidden rounded-2xl md:h-105 lg:h-130 '>
                    <Image src={hero} alt='Sports hero image' fill className='object-cover' priority />
                </div>
            </div>
        </section>
    )
}
export default Hero

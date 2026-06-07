import Card from './_components/Card'

const skeletonRows = ['Waiting list', 'Team A', 'Team B']

export default function Loading() {
    return (
        <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6'>
            <section aria-busy='true' aria-live='polite' className='space-y-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                    <div className='max-w-2xl space-y-3'>
                        <div className='h-3 w-36 animate-pulse rounded-full bg-[var(--brand-surface)]' />
                        <div className='h-10 w-full max-w-xl animate-pulse rounded-full bg-white/82' />
                        <div className='h-4 w-full max-w-2xl animate-pulse rounded-full bg-white/64' />
                    </div>
                    <div className='h-10 w-36 animate-pulse rounded-full bg-white/82' />
                </div>

                <Card tone='default' padding='lg'>
                    <div className='mb-6 flex flex-col gap-4 rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-5 lg:flex-row lg:items-center lg:justify-between'>
                        <div className='space-y-3'>
                            <div className='h-4 w-24 animate-pulse rounded-full bg-white/76' />
                            <div className='h-11 w-56 animate-pulse rounded-full bg-white/82' />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <div className='h-10 w-24 animate-pulse rounded-full bg-[var(--brand-surface)]' />
                            <div className='h-10 w-24 animate-pulse rounded-full bg-[var(--success-surface)]' />
                            <div className='h-10 w-24 animate-pulse rounded-full bg-[var(--warning-surface)]' />
                        </div>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-3'>
                        {skeletonRows.map((label, index) => (
                            <div
                                key={label}
                                className='min-h-64 rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)]'>
                                <div className='flex items-center justify-between gap-4'>
                                    <div className='space-y-2'>
                                        <div className='h-5 w-28 animate-pulse rounded-full bg-[var(--foreground)]/10' />
                                        <div className='h-3 w-36 animate-pulse rounded-full bg-[var(--muted)]/12' />
                                    </div>
                                    <div className='h-8 w-16 animate-pulse rounded-full bg-[var(--brand-surface)]' />
                                </div>

                                <div className='mt-6 grid gap-4'>
                                    {Array.from({ length: index === 0 ? 4 : 2 }, (_, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className='h-16 animate-pulse rounded-[22px] border border-[var(--line)] bg-[var(--surface)]'
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    )
}

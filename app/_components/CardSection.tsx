import type { ReactNode } from 'react'

type CardSectionProps = {
    eyebrow?: string
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
    className?: string
    contentClassName?: string
}

const CardSection = ({
    eyebrow,
    title,
    description,
    actions,
    children,
    className = '',
    contentClassName = '',
}: CardSectionProps) => {
    return (
        <section className={className}>
            <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div className='max-w-2xl space-y-2'>
                    {eyebrow ? (
                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]'>{eyebrow}</p>
                    ) : null}
                    <h2 className='text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl'>{title}</h2>
                    {description ? <p className='text-base leading-7 text-[var(--muted)]'>{description}</p> : null}
                </div>
                {actions ? <div className='shrink-0'>{actions}</div> : null}
            </div>
            <div className={['mt-8', contentClassName].filter(Boolean).join(' ')}>{children}</div>
        </section>
    )
}

export default CardSection

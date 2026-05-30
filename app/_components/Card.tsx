import type { HTMLAttributes } from 'react'

type CardTone = 'default' | 'subtle' | 'brand' | 'success' | 'warning'
type CardPadding = 'sm' | 'md' | 'lg'

type CardClassOptions = {
    tone?: CardTone
    padding?: CardPadding
    className?: string
}

type CardProps = HTMLAttributes<HTMLDivElement> & CardClassOptions

export function cardClasses({ tone = 'default', padding = 'md', className = '' }: CardClassOptions = {}) {
    const baseClasses = ['rounded-[28px] border shadow-[0_20px_60px_-38px_rgba(15,23,42,0.35)]']

    const toneClasses: Record<CardTone, string> = {
        default: 'border-[var(--line)] bg-[var(--surface-strong)]',
        subtle: 'border-white/70 bg-[var(--surface)] backdrop-blur-sm',
        brand: 'border-[var(--brand-border)] bg-[var(--brand-surface)]',
        success: 'border-[var(--success-border)] bg-[var(--success-surface)]',
        warning: 'border-[var(--warning-border)] bg-[var(--warning-surface)]',
    }

    const paddingClasses: Record<CardPadding, string> = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return [...baseClasses, toneClasses[tone], paddingClasses[padding], className].filter(Boolean).join(' ')
}

const Card = ({ tone = 'default', padding = 'md', className, ...props }: CardProps) => {
    return <div className={cardClasses({ tone, padding, className })} {...props} />
}

export default Card

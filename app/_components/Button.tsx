import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonClassOptions = {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    className?: string
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonClassOptions

export function buttonClasses({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
}: ButtonClassOptions = {}) {
    const baseClasses = [
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
    ]

    const variantClasses: Record<ButtonVariant, string> = {
        primary:
            'bg-[var(--brand)] text-white shadow-[0_18px_45px_-22px_rgba(15,118,110,0.9)] hover:bg-[var(--brand-strong)]',
        secondary:
            'border border-[var(--line)] bg-white/88 text-[var(--foreground)] shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] hover:bg-[var(--brand-surface)]',
        ghost: 'text-[var(--foreground)] hover:bg-white/70',
        danger: 'bg-[var(--danger)] text-white shadow-[0_18px_45px_-22px_rgba(220,38,38,0.85)] hover:bg-[#b91c1c]',
    }

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'min-h-10 px-4 text-sm',
        md: 'min-h-11 px-5 text-sm',
        lg: 'min-h-[3.25rem] px-6 text-base',
    }

    return [...baseClasses, variantClasses[variant], sizeClasses[size], fullWidth ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ')
}

const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    type = 'button',
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={buttonClasses({
                variant,
                size,
                fullWidth,
                className,
            })}
            {...props}
        />
    )
}

export default Button

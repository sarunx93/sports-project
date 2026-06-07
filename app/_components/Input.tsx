type InputProps = {
    label: string
    id: string
    placeholder: string
    value: string
    warning?: string
    onChangeHandler: (targetValue: string) => void
}

const Input = ({ label, id, placeholder, value, warning, onChangeHandler }: InputProps) => {
    const inputStyle =
        'mt-2 block w-full rounded-2xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-border)] focus:ring-2 focus:ring-[var(--ring)]'
    return (
        <>
            <label htmlFor='player-name' className='text-sm font-medium text-foreground'>
                {label}
            </label>
            <input
                id={id}
                type='text'
                className={inputStyle}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChangeHandler(e.target.value)}
            />
            <span className='text-xs mt-1 text-amber-800'>{warning}</span>
        </>
    )
}
export default Input

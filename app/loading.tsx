export default function Loading() {
    return (
        <div
            aria-live='polite'
            aria-busy='true'
            className='flex min-h-[calc(100dvh-4.5rem)] w-full items-center justify-center'>
            <div
                role='status'
                aria-label='Loading'
                className='h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand-surface)] border-t-[var(--brand)]'
            />
        </div>
    )
}

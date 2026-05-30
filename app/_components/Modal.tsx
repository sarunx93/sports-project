'use client'

import Button from './Button'

type ConfirmModalProps = {
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,32,51,0.48)] px-4 backdrop-blur-sm'>
            <div className='w-full max-w-md rounded-[28px] border border-white/70 bg-[var(--surface-strong)] p-6 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.55)]'>
                <h2 className='text-xl font-semibold text-[var(--foreground)]'>{title}</h2>
                <p className='mt-3 text-sm leading-7 text-[var(--muted)]'>{message}</p>

                <div className='mt-6 flex justify-end gap-3'>
                    <Button onClick={onCancel} variant='ghost' className='border border-[var(--line)] bg-white/75'>
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} variant='danger'>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

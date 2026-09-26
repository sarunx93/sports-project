'use client'

import { SignInButton, SignUpButton, useSignIn, useSignUp } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi'
import { z } from 'zod'
import logo from '@/public/sports_logo.png'
import Button, { buttonClasses } from './Button'

type AuthMode = 'login' | 'register'

type LoginProps = {
    initialMode?: AuthMode
    redirectTo?: string
}

type CredentialFields = {
    email: string
    name: string
    password: string
}

type FieldErrors = Partial<Record<keyof CredentialFields | 'code', string>>

const loginSchema = z.object({
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
})

const registerSchema = loginSchema.extend({
    name: z.string().min(3, 'Name must be at least 3 characters long.'),
    password: z.string().min(8, 'Password must be at least 8 characters.').max(128, 'Password is too long.'),
})

const verificationSchema = z.object({
    code: z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Enter the 6-digit code from your email.'),
})

const inputClasses =
    'block w-full rounded-2xl border border-(--line) bg-white/90 py-3.5 pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-(--muted) focus:border-(--brand) focus:ring-4 focus:ring-(--ring)'

function getClerkErrorMessage(error: unknown) {
    if (isClerkAPIResponseError(error)) {
        return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? 'Authentication could not be completed.'
    }

    if (typeof error === 'object' && error && 'longMessage' in error && typeof error.longMessage === 'string') {
        return error.longMessage
    }

    return error instanceof Error ? error.message : 'Authentication could not be completed. Please try again.'
}

const Login = ({ initialMode = 'login', redirectTo = '/sports/badminton' }: LoginProps) => {
    const router = useRouter()
    const { signIn, fetchStatus: signInFetchStatus } = useSignIn()
    const { signUp, fetchStatus: signUpFetchStatus } = useSignUp()
    const [mode, setMode] = useState<AuthMode>(initialMode)
    const [fields, setFields] = useState<CredentialFields>({ email: '', name: '', password: '' })
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [formError, setFormError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationEmail, setVerificationEmail] = useState('')
    const [isResending, setIsResending] = useState(false)

    const isClerkFetching = signInFetchStatus === 'fetching' || signUpFetchStatus === 'fetching'
    const destination = mode === 'register' ? '/register' : redirectTo

    function changeMode(nextMode: AuthMode) {
        setMode(nextMode)
        setFieldErrors({})
        setFormError('')
        setIsVerifying(false)
        setVerificationCode('')

        const query = new URLSearchParams({ mode: nextMode })
        if (redirectTo !== '/sports/badminton') {
            query.set('redirect_url', redirectTo)
        }
        router.replace(`/login?${query.toString()}`, { scroll: false })
    }

    function updateField(field: keyof CredentialFields, value: string) {
        setFields((current) => ({ ...current, [field]: value }))
        setFieldErrors((current) => ({ ...current, [field]: undefined }))
        setFormError('')
    }

    async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setFormError('')

        const parsed = (mode === 'login' ? loginSchema : registerSchema).safeParse(fields)

        if (!parsed.success) {
            const errors: FieldErrors = {}
            for (const issue of parsed.error.issues) {
                const field = issue.path[0] as keyof CredentialFields
                errors[field] ??= issue.message
            }
            setFieldErrors(errors)
            return
        }

        setIsSubmitting(true)
        setFieldErrors({})

        try {
            if (mode === 'login') {
                //sign in logic from clerk
                const result = await signIn.password({
                    emailAddress: parsed.data.email,
                    password: parsed.data.password,
                })

                if (result.error) {
                    setFormError(getClerkErrorMessage(result.error))
                    return
                }

                if (signIn.status === 'complete') {
                    const finalization = await signIn.finalize()
                    if (finalization.error) {
                        setFormError(getClerkErrorMessage(finalization.error))
                        return
                    }
                    router.replace(destination)
                    router.refresh()
                    return
                }

                setFormError(
                    'This account needs an additional verification step. Use the Clerk option below to continue.',
                )
                return
            }

            //sign up logic from clerk
            const result = await signUp.password({
                emailAddress: parsed.data.email,
                password: parsed.data.password,
                firstName: fields.name.trim(),
            })

            if (result.error) {
                setFormError(getClerkErrorMessage(result.error))
                return
            }

            if (signUp.status === 'complete') {
                const finalization = await signUp.finalize()
                if (finalization.error) {
                    setFormError(getClerkErrorMessage(finalization.error))
                    return
                }
                router.replace(destination)
                router.refresh()
                return
            }

            if (signUp.unverifiedFields.includes('email_address')) {
                const verification = await signUp.verifications.sendEmailCode()
                if (verification.error) {
                    setFormError(getClerkErrorMessage(verification.error))
                    return
                }
                setVerificationEmail(parsed.data.email)
                setIsVerifying(true)
                return
            }

            setFormError(
                'Your Clerk configuration requires more account details. Use the Clerk option below to finish.',
            )
        } catch (error) {
            setFormError(getClerkErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleVerificationSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setFormError('')

        const parsed = verificationSchema.safeParse({ code: verificationCode })
        if (!parsed.success) {
            setFieldErrors({ code: parsed.error.issues[0]?.message })
            return
        }

        setIsSubmitting(true)
        setFieldErrors({})

        try {
            const result = await signUp.verifications.verifyEmailCode({ code: parsed.data.code })

            if (result.error) {
                setFormError(getClerkErrorMessage(result.error))
                return
            }

            if (signUp.status === 'complete') {
                const finalization = await signUp.finalize()
                if (finalization.error) {
                    setFormError(getClerkErrorMessage(finalization.error))
                    return
                }
                router.replace('/register')
                router.refresh()
                return
            }

            setFormError('Verification is not complete yet. Check the code and try again.')
        } catch (error) {
            setFormError(getClerkErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function resendVerificationCode() {
        setIsResending(true)
        setFormError('')
        try {
            const result = await signUp.verifications.sendEmailCode()
            if (result.error) {
                setFormError(getClerkErrorMessage(result.error))
            }
        } catch (error) {
            setFormError(getClerkErrorMessage(error))
        } finally {
            setIsResending(false)
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFieldErrors({})
        }, 3000)

        return () => clearTimeout(timeoutId)
    }, [fieldErrors])

    const clerkButton =
        mode === 'login' ? (
            <SignInButton mode='modal' forceRedirectUrl={redirectTo}>
                <button type='button' className={buttonClasses({ variant: 'secondary', fullWidth: true, size: 'lg' })}>
                    <FiShield aria-hidden='true' />
                    Continue with Clerk
                </button>
            </SignInButton>
        ) : (
            <SignUpButton mode='modal' forceRedirectUrl='/register'>
                <button type='button' className={buttonClasses({ variant: 'secondary', fullWidth: true, size: 'lg' })}>
                    <FiShield aria-hidden='true' />
                    Continue with Clerk
                </button>
            </SignUpButton>
        )

    return (
        <section className='relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-16'>
            <div
                aria-hidden='true'
                className='absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_15%,rgba(15,118,110,0.18),transparent_34%),radial-gradient(circle_at_88%_75%,rgba(227,164,88,0.22),transparent_30%)]'
            />
            <div className='mx-auto grid min-h-170 max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white/72 shadow-[0_38px_100px_-55px_rgba(18,32,51,0.58)] backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]'>
                <aside className='relative hidden overflow-hidden bg-(--brand) p-10 text-white lg:flex lg:flex-col lg:justify-between'>
                    <div
                        aria-hidden='true'
                        className='absolute -right-24 -top-24 size-72 rounded-full border-44 border-white/10'
                    />
                    <div aria-hidden='true' className='absolute -bottom-24 -left-20 size-64 rounded-full bg-white/8' />

                    <div className='relative flex items-center gap-3'>
                        <div className='rounded-2xl bg-white/95 p-1 shadow-lg'>
                            <Image src={logo} alt='' className='size-12 rounded-xl object-cover' />
                        </div>
                        <div>
                            <p className='font-heading text-xl font-semibold'>Match Desk</p>
                            <p className='text-xs uppercase tracking-[0.22em] text-white/65'>Organize neatly</p>
                        </div>
                    </div>

                    <div className='relative'>
                        <p className='text-xs font-semibold uppercase tracking-[0.28em] text-white/65'>
                            Your club, in motion
                        </p>
                        <h1 className='mt-5 max-w-sm font-heading text-5xl font-semibold leading-[1.05] tracking-tight'>
                            Spend less time sorting. Play more.
                        </h1>
                        <p className='mt-5 max-w-md text-base leading-7 text-white/75'>
                            Keep players, matches, and live court activity together in one calm workspace.
                        </p>
                    </div>

                    <ul className='relative space-y-3 text-sm text-white/80'>
                        {[
                            'Secure sessions powered by Clerk',
                            'One account for every protected workspace',
                            'Your club data stays connected',
                        ].map((item) => (
                            <li key={item} className='flex items-center gap-3'>
                                <span className='flex size-6 items-center justify-center rounded-full bg-white/12'>
                                    <FiCheck aria-hidden='true' className='size-3.5' />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className='flex items-center px-5 py-10 sm:px-12 lg:px-16'>
                    <div className='mx-auto w-full max-w-md'>
                        <div className='mb-8 flex items-center gap-3 lg:hidden'>
                            <Image src={logo} alt='' className='size-11 rounded-xl object-cover' />
                            <p className='font-heading text-xl font-semibold text-foreground'>Match Desk</p>
                        </div>

                        {isVerifying ? (
                            <div>
                                <div className='flex size-12 items-center justify-center rounded-2xl bg-(--brand-surface) text-(--brand)'>
                                    <FiMail aria-hidden='true' className='size-5' />
                                </div>
                                <p className='mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>
                                    Check your inbox
                                </p>
                                <h2 className='mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground'>
                                    Verify your email
                                </h2>
                                <p className='mt-3 text-sm leading-6 text-(--muted)'>
                                    We sent a 6-digit code to{' '}
                                    <span className='font-medium text-foreground'>{verificationEmail}</span>.
                                </p>

                                <form onSubmit={handleVerificationSubmit} className='mt-8' noValidate>
                                    <label htmlFor='verification-code' className='text-sm font-medium text-foreground'>
                                        Verification code
                                    </label>
                                    <input
                                        id='verification-code'
                                        name='code'
                                        type='text'
                                        inputMode='numeric'
                                        autoComplete='one-time-code'
                                        maxLength={6}
                                        value={verificationCode}
                                        onChange={(event) => {
                                            setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                                            setFieldErrors((current) => ({ ...current, code: undefined }))
                                            setFormError('')
                                        }}
                                        aria-invalid={Boolean(fieldErrors.code)}
                                        aria-describedby={fieldErrors.code ? 'verification-code-error' : undefined}
                                        className='mt-2 block w-full rounded-2xl border border-(--line) bg-white/90 px-4 py-4 text-center font-mono text-xl tracking-[0.5em] text-foreground outline-none transition focus:border-(--brand) focus:ring-4 focus:ring-(--ring)'
                                        placeholder='000000'
                                    />
                                    {fieldErrors.code ? (
                                        <p id='verification-code-error' className='mt-2 text-sm text-(--danger)'>
                                            {fieldErrors.code}
                                        </p>
                                    ) : null}

                                    {formError ? (
                                        <div
                                            role='alert'
                                            className='mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700'>
                                            {formError}
                                        </div>
                                    ) : null}

                                    <Button type='submit' fullWidth size='lg' className='mt-6' disabled={isSubmitting}>
                                        {isSubmitting ? 'Verifying…' : 'Verify and continue'}
                                        {!isSubmitting ? <FiArrowRight aria-hidden='true' /> : null}
                                    </Button>
                                </form>

                                <div className='mt-5 flex flex-wrap items-center justify-between gap-3 text-sm'>
                                    <button
                                        type='button'
                                        onClick={() => setIsVerifying(false)}
                                        className='cursor-pointer font-medium text-(--muted) hover:text-foreground'>
                                        Change email
                                    </button>
                                    <button
                                        type='button'
                                        onClick={resendVerificationCode}
                                        disabled={isResending}
                                        className='cursor-pointer font-medium text-(--brand) hover:text-(--brand-strong) disabled:cursor-not-allowed disabled:opacity-50'>
                                        {isResending ? 'Sending…' : 'Resend code'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-(--brand)'>
                                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                                </p>
                                <h2 className='mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground'>
                                    {mode === 'login' ? 'Sign in to Match Desk' : 'Join Match Desk'}
                                </h2>
                                <p className='mt-3 text-sm leading-6 text-(--muted)'>
                                    {mode === 'login'
                                        ? 'Pick up where your last session ended.'
                                        : 'Create your login, then set up your first club.'}
                                </p>

                                <div
                                    className='mt-7 grid grid-cols-2 rounded-full bg-(--background-alt) p-1'
                                    aria-label='Authentication mode'>
                                    {(['login', 'register'] as const).map((item) => (
                                        <button
                                            key={item}
                                            type='button'
                                            onClick={() => changeMode(item)}
                                            aria-pressed={mode === item}
                                            className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium capitalize transition ${
                                                mode === item
                                                    ? 'bg-white text-foreground shadow-sm'
                                                    : 'text-(--muted) hover:text-foreground'
                                            }`}>
                                            {item === 'login' ? 'Sign in' : 'Register'}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleCredentialsSubmit} className='mt-7 space-y-5' noValidate>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor='email' className='text-sm font-medium text-foreground'>
                                            Email address
                                        </label>
                                        <div className='relative mt-2'>
                                            <FiMail
                                                aria-hidden='true'
                                                className='absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--muted)'
                                            />
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                autoComplete='email'
                                                value={fields.email}
                                                onChange={(event) => updateField('email', event.target.value)}
                                                aria-invalid={Boolean(fieldErrors.email)}
                                                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                                className={inputClasses}
                                                placeholder='you@example.com'
                                            />
                                        </div>
                                        {fieldErrors.email ? (
                                            <p id='email-error' className='mt-2 text-sm text-(--danger)'>
                                                {fieldErrors.email}
                                            </p>
                                        ) : null}
                                    </div>
                                    {/* Name */}
                                    {mode !== 'login' && (
                                        <div>
                                            <label htmlFor='name' className='text-sm font-medium text-foreground'>
                                                Name
                                            </label>
                                            <div className='relative mt-2'>
                                                <FiMail
                                                    aria-hidden='true'
                                                    className='absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--muted)'
                                                />
                                                <input
                                                    id='name'
                                                    name='name'
                                                    type='name'
                                                    autoComplete='name'
                                                    value={fields.name}
                                                    onChange={(event) => updateField('name', event.target.value)}
                                                    aria-invalid={Boolean(fieldErrors.name)}
                                                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                                    className={inputClasses}
                                                    placeholder='At least 3 characters'
                                                />
                                            </div>
                                            {fieldErrors.name ? (
                                                <p id='name-error' className='mt-2 text-sm text-(--danger)'>
                                                    {fieldErrors.name}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor='password' className='text-sm font-medium text-foreground'>
                                            Password
                                        </label>
                                        <div className='relative mt-2'>
                                            <FiLock
                                                aria-hidden='true'
                                                className='absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--muted)'
                                            />
                                            <input
                                                id='password'
                                                name='password'
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                                value={fields.password}
                                                onChange={(event) => updateField('password', event.target.value)}
                                                aria-invalid={Boolean(fieldErrors.password)}
                                                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                                className={inputClasses}
                                                placeholder={
                                                    mode === 'login' ? 'Enter your password' : 'At least 8 characters'
                                                }
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword((current) => !current)}
                                                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-(--muted) hover:text-foreground'
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                                {showPassword ? (
                                                    <FiEyeOff aria-hidden='true' />
                                                ) : (
                                                    <FiEye aria-hidden='true' />
                                                )}
                                            </button>
                                        </div>
                                        {fieldErrors.password ? (
                                            <p id='password-error' className='mt-2 text-sm text-(--danger)'>
                                                {fieldErrors.password}
                                            </p>
                                        ) : mode === 'register' ? (
                                            <p className='mt-2 text-xs text-(--muted)'>Use 8 or more characters.</p>
                                        ) : null}
                                    </div>

                                    {formError ? (
                                        <div
                                            role='alert'
                                            className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700'>
                                            {formError}
                                        </div>
                                    ) : null}

                                    <Button
                                        type='submit'
                                        fullWidth
                                        size='lg'
                                        disabled={isSubmitting || isClerkFetching}>
                                        {isSubmitting
                                            ? mode === 'login'
                                                ? 'Signing in…'
                                                : 'Creating account…'
                                            : mode === 'login'
                                              ? 'Sign in'
                                              : 'Create account'}
                                        {!isSubmitting ? <FiArrowRight aria-hidden='true' /> : null}
                                    </Button>
                                </form>

                                <div className='my-6 flex items-center gap-4' aria-hidden='true'>
                                    <span className='h-px flex-1 bg-(--line)' />
                                    <span className='text-xs font-medium uppercase tracking-[0.16em] text-(--muted)'>
                                        or
                                    </span>
                                    <span className='h-px flex-1 bg-(--line)' />
                                </div>

                                {clerkButton}

                                <p className='mt-7 text-center text-sm text-(--muted)'>
                                    {mode === 'login' ? 'New to Match Desk?' : 'Already have an account?'}{' '}
                                    <button
                                        type='button'
                                        onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
                                        className='cursor-pointer font-semibold text-(--brand) hover:text-(--brand-strong)'>
                                        {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login

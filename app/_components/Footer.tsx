import Link from 'next/link'

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/sports/badminton', label: 'Badminton' },
    { href: '/sports/tennis', label: 'Tennis' },
    { href: '/sports/football', label: 'Football' },
    { href: '/register', label: 'Club Setup' },
]

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className='border-t border-(--line) bg-[rgba(255,255,255,0.56)]'>
            <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
                <div className='grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]'>
                    <section className='space-y-3'>
                        <h2 className='text-lg font-semibold text-foreground'>Match Desk</h2>
                        <p className='max-w-md text-sm leading-7 text-(--muted)'>
                            Organize club sessions, manage players, and keep match flow moving without losing the
                            details.
                        </p>
                    </section>

                    <nav aria-labelledby='footer-nav' className='space-y-3'>
                        <h2
                            id='footer-nav'
                            className='text-sm font-semibold uppercase tracking-[0.18em] text-(--muted)'>
                            Explore
                        </h2>
                        <ul className='space-y-2 flex gap-5'>
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-sm text-foreground transition hover:text-(--brand)'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className='mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-(--muted) sm:flex-row sm:items-center sm:justify-between'>
                    <small>&copy; {year} Match Desk. All rights reserved.</small>
                    <p>Built for club admins and players.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer

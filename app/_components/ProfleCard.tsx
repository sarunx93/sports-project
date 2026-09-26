'use client'
import Link from 'next/link'
import { useUserStore } from '../_providers/user-store-provider'
import Card from './Card'
import { buttonClasses } from './Button'

const ProfleCard = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    return (
        <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
            <Card
                tone='brand'
                padding='lg'
                className='relative overflow-hidden bg-cover bg-center'
                style={{
                    backgroundImage: "url('/badminton_card.png')",
                    backgroundPosition: 'center 30%',
                }}>
                <div className='pointer-events-none absolute inset-0 bg-black/10' />

                <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
                    <div>
                        <p className='text-lg text-amber-50 font-semibold uppercase tracking-[0.24em]'>ยินดีต้อนรับ</p>
                        <h1 className='mt-4 text-4xl font-semibold tracking-tight  md:text-5xl text-amber-100'>
                            {currentUser?.fullName}
                        </h1>

                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Link href='/sports/badminton/match-arrange' className={buttonClasses({ size: 'lg' })}>
                                <p className='text-white bold'>เริ่มจัดก๊วน</p>
                            </Link>
                            <Link
                                href='/sports/badminton/all-matches'
                                className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
                                ดู Match ที่กำลังเล่นอยู่
                            </Link>
                        </div>
                    </div>

                    <div className='grid gap-4 items-center'>
                        <div className='rounded-3xl border border-white/80 bg-white p-5'>
                            <p className='text-sm font-medium text-foreground'>Player</p>
                            <p className='mt-2 text-2xl font-semibold text-foreground'>{currentUser?.clubName}</p>
                            <p className='mt-1 text-sm text-(--muted)'>Signed in and ready for session setup</p>
                        </div>
                    </div>
                </div>
            </Card>
            <Card
                tone='brand'
                padding='lg'
                className='relative overflow-hidden bg-cover bg-center mt-5'
                style={{
                    backgroundImage: "url('/court.png')",
                    backgroundPosition: 'center 30%',
                }}>
                <div className='flex items-center justify-around gap-5'>
                    <Card padding='lg' className='w-full overflow-hidden'>
                        <h1 className='mb-3 text-md font-semibold tracking-tight  md:text-5xl'>🗓️ ตารางก๊วน</h1>
                        <div className='overflow-hidden rounded-2xl border border-(--line)'>
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse text-left'>
                                    <thead className='bg-(--surface)'>
                                        <tr>
                                            <th
                                                scope='col'
                                                className='px-5 py-4 font-semibold uppercase tracking-wider text-(--muted)'>
                                                วัน
                                            </th>
                                            <th
                                                scope='col'
                                                className='px-5 py-4 font-semibold uppercase tracking-wider text-(--muted)'>
                                                เวลา
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-(--line) bg-white/70'>
                                        <tr className='transition-colors hover:bg-(--surface)'>
                                            <td className='px-5 py-4 font-semibold text-foreground'>วันจันทร์</td>
                                            <td className='px-5 py-4 tabular-nums text-(--muted)'>20:00 - 00:00</td>
                                        </tr>
                                        <tr className='transition-colors hover:bg-(--surface)'>
                                            <td className='px-5 py-4 font-semibold text-foreground'>วันพุทธ</td>
                                            <td className='px-5 py-4 tabular-nums text-(--muted)'>20:00 - 00:00</td>
                                        </tr>
                                        <tr className='transition-colors hover:bg-(--surface)'>
                                            <td className='px-5 py-4 font-semibold text-foreground'>วันศุกร์</td>
                                            <td className='px-5 py-4 tabular-nums text-(--muted)'>20:00 - 00:00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                    <Card padding='lg' className='w-full overflow-hidden'>
                        <h1 className='mb-3 text-md font-semibold tracking-tight  md:text-5xl'>📊 สถิติ</h1>
                        <div className='flex flex-col gap-5'>
                            <Card padding='md'>
                                <h3 className='text-2xl'>🧒🏻 จำนวนผู้เล่น</h3>
                                <p>เฉลี่ยในรอบ 1 เดือน: 99 คน</p>
                                <p>ล่าสุด: 99 คน</p>
                            </Card>
                            <Card padding='md'>
                                <h3 className='text-2xl'>🏸 จำนวนลูกที่ใช้</h3>
                                <p>เฉลี่ยในรอบ 1 เดือน: 99 ลูก</p>
                                <p>ล่าสุด: 99 ลูก</p>
                            </Card>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    )
}
export default ProfleCard

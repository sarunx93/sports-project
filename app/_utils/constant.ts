// Ordered to match JavaScript Date.getDay(): Sunday = 0, Saturday = 6.
export const DAYS_OF_WEEK = [
    { value: 0, th: { full: 'วันอาทิตย์', short: 'อา.' }, en: { full: 'Sunday', short: 'Sun' } },
    { value: 1, th: { full: 'วันจันทร์', short: 'จ.' }, en: { full: 'Monday', short: 'Mon' } },
    { value: 2, th: { full: 'วันอังคาร', short: 'อ.' }, en: { full: 'Tuesday', short: 'Tue' } },
    { value: 3, th: { full: 'วันพุธ', short: 'พ.' }, en: { full: 'Wednesday', short: 'Wed' } },
    { value: 4, th: { full: 'วันพฤหัสบดี', short: 'พฤ.' }, en: { full: 'Thursday', short: 'Thu' } },
    { value: 5, th: { full: 'วันศุกร์', short: 'ศ.' }, en: { full: 'Friday', short: 'Fri' } },
    { value: 6, th: { full: 'วันเสาร์', short: 'ส.' }, en: { full: 'Saturday', short: 'Sat' } },
] as const

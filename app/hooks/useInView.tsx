import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement | null>(null)
    const [isInView, setIsInView] = useState<boolean>(false)

    useEffect(() => {
        const target = ref.current

        if (!target) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                // entry
                // {
                //     isIntersecting: true,
                //     intersectionRatio: 0.5,
                //     target: <div>
                // }
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.unobserve(target)
                }
            },
            {
                threshold: 0.3,
                ...options,
            },
        )
        observer.observe(target)
        return () => observer.disconnect()
    }, [options])
    return { ref, isInView }
}

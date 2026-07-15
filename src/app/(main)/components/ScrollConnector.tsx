"use client"

import { useEffect, useState } from "react"

interface ScrollConnectorProps {
    sections: {
        id: string
        ref: React.RefObject<HTMLDivElement | null>
    }[]
}

function useIsDesktop(): boolean {
    const [isDesktop, setIsDesktop] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)")
        setIsDesktop(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])
    return isDesktop
}

export default function ScrollConnector({ sections }: ScrollConnectorProps) {
    const isDesktop = useIsDesktop()
    const totalSections = sections.length

    if (!isDesktop) return null

    return <ScrollConnectorDesktop sections={sections} totalSections={totalSections} />
}

function ScrollConnectorDesktop({ sections, totalSections }: ScrollConnectorProps & { totalSections: number }) {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <div className="relative h-[50vh] w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#D6F045] via-emerald-500 to-emerald-600 rounded-full origin-top"
                    style={{ transform: `scaleY(${scrollProgress})`, transformOrigin: "top", willChange: "transform" }}
                />
            </div>

            {sections.map((section, index) => (
                <ScrollIndicator
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={totalSections}
                />
            ))}
        </div>
    )
}

function ScrollIndicator({ section, index, totalSections }: { section: { id: string; ref: React.RefObject<HTMLDivElement | null> }, index: number, totalSections: number }) {
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const el = section.ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsActive(entry.isIntersecting)
            },
            { threshold: [0.2, 0.8] }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [section.ref])

    return (
        <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-lg cursor-pointer transition-all duration-200 ease-out ${
                isActive ? "bg-[#D6F045] scale-125" : "bg-gray-400 dark:bg-gray-600"
            }`}
            style={{ top: `${(index + 1) * (100 / (totalSections + 1))}%` }}
            onClick={() => {
                section.ref.current?.scrollIntoView({ behavior: "smooth" })
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1.5)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(-50%)"
            }}
        />
    )
}

"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealProps {
    children: ReactNode
    direction?: "up" | "down" | "left" | "right" | "fade"
    delay?: number
    duration?: number
    className?: string
    once?: boolean
}

export default function Reveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    className = "",
    once = true,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (once) observer.unobserve(el)
                } else if (!once) {
                    setIsVisible(false)
                }
            },
            { rootMargin: "-100px" }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [once])

    const offsets: Record<string, { x?: string; y?: string }> = {
        up: { y: "30px" },
        down: { y: "-30px" },
        left: { x: "30px" },
        right: { x: "-30px" },
        fade: {},
    }

    const offset = offsets[direction]

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translate(0, 0)" : `translate(${offset.x || "0"}, ${offset.y || "0"})`,
                transition: `opacity ${duration}s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform ${duration}s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
            }}
        >
            {children}
        </div>
    )
}

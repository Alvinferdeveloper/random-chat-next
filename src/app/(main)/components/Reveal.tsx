"use client"

import { motion, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"

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
    once = true
}: RevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, margin: "-100px" })

    const directions = {
        up: { y: 50, x: 0 },
        down: { y: -50, x: 0 },
        left: { x: 50, y: 0 },
        right: { x: -50, y: 0 },
        fade: { opacity: 0 }
    }

    return (
        <motion.div
            ref={ref}
            initial={{ ...directions[direction], opacity: 0 }}
            animate={isInView ? { y: 0, x: 0, opacity: 1 } : { ...directions[direction], opacity: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

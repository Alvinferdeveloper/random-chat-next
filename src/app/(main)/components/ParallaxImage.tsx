"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface ParallaxImageProps {
    children: React.ReactNode
    speed?: number
    className?: string
}

export default function ParallaxImage({ children, speed = 0.5, className = "" }: ParallaxImageProps) {
    const ref = useRef<HTMLDivElement>(null)
    
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div style={{ y }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    )
}

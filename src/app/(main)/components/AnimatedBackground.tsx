"use client"

import { motion } from "framer-motion"
import { useEffect, useState, CSSProperties } from "react"

export default function AnimatedBackground() {
    const [particles, setParticles] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 5,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background dark:to-emerald-950/30 to-emerald-100/50" />

            <motion.div
                className="absolute top-0 left-1/4 w-[600px] h-[600px] dark:bg-emerald-500/5 bg-emerald-300/20 rounded-full blur-[120px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-0 right-1/4 w-[500px] h-[500px] dark:bg-[#D6F045]/5 bg-lime-200/30 rounded-full blur-[100px]"
                animate={{
                    x: [0, -80, 0],
                    y: [0, -60, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] dark:from-emerald-500/5 dark:to-[#D6F045]/5 bg-gradient-to-tr from-emerald-200/30 to-teal-100/40 rounded-full blur-[150px]"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full dark:bg-emerald-400/30 bg-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.2)] dark:shadow-none"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}

            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                } as CSSProperties}
            />
        </div>
    )
}
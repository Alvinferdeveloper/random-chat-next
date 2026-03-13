"use client"

import { motion } from "framer-motion"
import { useEffect, useState, memo } from "react"

function ParkBackgroundComponent() {
    const [clouds, setClouds] = useState<{ id: number; x: number; y: number; scale: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        const newClouds = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: -20, // Start off-screen left
            y: 10 + Math.random() * 40,
            scale: 0.5 + Math.random() * 1.5,
            duration: 40 + Math.random() * 40,
            delay: Math.random() * -60, // Negative delay to start at random positions
        }))
        setClouds(newClouds)
    }, [])

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Sky Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-50" />

            {/* Sun */}
            <motion.div 
                className="absolute top-10 right-10 w-32 h-32 rounded-full bg-yellow-200 blur-2xl opacity-60"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-16 right-16 w-20 h-20 rounded-full bg-yellow-400 opacity-80 shadow-[0_0_50px_rgba(250,204,21,0.5)]" />

            {/* Clouds */}
            {clouds.map((cloud) => (
                <motion.div
                    key={cloud.id}
                    className="absolute text-white opacity-40"
                    style={{ top: `${cloud.y}%`, left: `${cloud.x}%` }}
                    initial={{ x: "-20vw" }}
                    animate={{ x: "120vw" }}
                    transition={{
                        duration: cloud.duration,
                        repeat: Infinity,
                        delay: cloud.delay,
                        ease: "linear",
                    }}
                >
                    <svg width={100 * cloud.scale} height={60 * cloud.scale} viewBox="0 0 100 60">
                        <path
                            fill="currentColor"
                            d="M20,40 Q20,20 40,20 Q45,10 60,10 Q80,10 80,30 Q95,30 95,45 Q95,60 80,60 L20,60 Q5,60 5,45 Q5,30 20,40 Z"
                        />
                    </svg>
                </motion.div>
            ))}

            {/* Mountains/Hills */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#86efac" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#dcfce7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#f0fdf4" stopOpacity="1" />
                    </linearGradient>
                </defs>

                <path
                    d="M0 60 Q20 50 40 58 Q60 48 80 55 Q95 50 100 60 L100 100 L0 100 Z"
                    fill="url(#hillGrad2)"
                />

                <path
                    d="M0 70 Q25 60 50 68 Q75 58 100 68 L100 100 L0 100 Z"
                    fill="url(#hillGrad1)"
                />

                <path
                    d="M0 85 Q15 83 30 85 Q50 81 70 84 Q90 82 100 85 L100 100 L0 100 Z"
                    fill="url(#groundGrad)"
                />
            </svg>

            {/* Subtle Texture */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    )
}

export default memo(ParkBackgroundComponent);

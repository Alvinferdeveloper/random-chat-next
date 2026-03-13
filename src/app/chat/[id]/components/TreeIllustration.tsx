"use client"

import { motion } from "framer-motion"
import { useMemo, memo } from "react"

interface TreeIllustrationProps {
    className?: string
}

function TreeIllustrationComponent({ className = "w-64 h-64" }: TreeIllustrationProps) {
    const leaves = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 40,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
    })), [])

    return (
        <div className={`relative ${className} flex items-end justify-center overflow-visible`}>
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                {/* Trunk */}
                <path
                    d="M45 120 L48 80 Q50 70 52 80 L55 120 Z"
                    fill="#78350f"
                />
                
                {/* Foliage (animated sway) */}
                <motion.g
                    animate={{ rotate: [-1, 1, -1], x: [-0.5, 0.5, -0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: "50px", originY: "100px" }}
                >
                    {/* Main Foliage circles */}
                    <circle cx="50" cy="55" r="35" fill="#15803d" />
                    <circle cx="35" cy="45" r="25" fill="#166534" />
                    <circle cx="65" cy="45" r="25" fill="#166534" />
                    <circle cx="50" cy="30" r="20" fill="#22c55e" opacity="0.6" />
                </motion.g>

                {/* Falling Leaves */}
                {leaves.map((leaf) => (
                    <motion.path
                        key={leaf.id}
                        d="M0 0 C2 5 8 5 10 0 C8 -5 2 -5 0 0 Z"
                        fill="#22c55e"
                        className="opacity-60"
                        initial={{ x: leaf.x, y: leaf.y, rotate: 0, opacity: 0 }}
                        animate={{ 
                            y: [leaf.y, 110], 
                            x: [leaf.x, leaf.x + (Math.random() * 20 - 10)],
                            rotate: [0, 360],
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            delay: leaf.delay,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

export default memo(TreeIllustrationComponent);

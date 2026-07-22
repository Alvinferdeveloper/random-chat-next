"use client"

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

                {/* Foliage (animated sway via CSS) */}
                <g className="animate-tree-sway" style={{ transformOrigin: "50px 100px" }}>
                    <circle cx="50" cy="55" r="35" fill="#15803d" />
                    <circle cx="35" cy="45" r="25" fill="#166534" />
                    <circle cx="65" cy="45" r="25" fill="#166534" />
                    <circle cx="50" cy="30" r="20" fill="#22c55e" opacity="0.6" />
                </g>

                {/* Falling Leaves */}
                {leaves.map((leaf) => (
                    <path
                        key={leaf.id}
                        d="M0 0 C2 5 8 5 10 0 C8 -5 2 -5 0 0 Z"
                        fill="#22c55e"
                        className="opacity-60 animate-leaf-fall"
                        style={{
                            transformOrigin: `${leaf.x}px ${leaf.y}px`,
                            animationDuration: `${leaf.duration}s`,
                            animationDelay: `${leaf.delay}s`,
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

export default memo(TreeIllustrationComponent);

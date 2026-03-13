"use client"

import { useEffect, useRef, useState, memo } from "react"
import lottie from "lottie-web"

interface CampfireLottieProps {
    src?: string
    className?: string
}

function CampfireLottieComponent({ src, className = "w-64 h-64" }: CampfireLottieProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        if (!src) return

        fetch(src)
            .then(res => res.json())
            .then(data => {
                setAnimationData(data)
            })
            .catch(err => console.error("Error loading animation:", err))
    }, [src])

    useEffect(() => {
        if (!containerRef.current || !animationData) return

        const anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animationData,
        })

        return () => {
            anim.destroy()
        }
    }, [animationData])

    if (!src) {
        return (
            <div className={`${className} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-orange-500/20 animate-pulse" />
                    <p className="text-xs text-stone-400">Añade tu animación</p>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className={className} />
    )
}

export default memo(CampfireLottieComponent);

"use client"

import { useEffect, useState } from "react"

interface ConnectingAnimationProps {
    text: string
}

export function ConnectingAnimation({ text }: ConnectingAnimationProps) {
    const [dots, setDots] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return ""
                return prev + "."
            })
        }, 400)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-3">
            <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm font-medium text-center text-muted-foreground">
                {text}
                {dots}
            </p>
        </div>
    )
}

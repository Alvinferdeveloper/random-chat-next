"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Evitar errores de hidratación
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="w-14 h-8 bg-muted rounded-full opacity-20" />

    const isDark = resolvedTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary cursor-pointer group"
            aria-label="Alternar tema"
        >
            {/* Background Decorator (Opcional: pequeñas estrellas o nubes sutiles) */}
            <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="stars"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-around items-center h-full px-2"
                        >
                            <div className="w-0.5 h-0.5 bg-white rounded-full" />
                            <div className="w-0.5 h-0.5 bg-white rounded-full translate-y-1" />
                            <div className="w-0.5 h-0.5 bg-white rounded-full -translate-y-1" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="clouds"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex justify-around items-center h-full px-2"
                        >
                            <div className="w-2 h-1 bg-white rounded-full opacity-60" />
                            <div className="w-2 h-1 bg-white rounded-full opacity-60 -translate-y-1" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sliding Thumb */}
            <motion.div
                className="relative z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center overflow-hidden"
                animate={{
                    x: isDark ? 24 : 0,
                    backgroundColor: isDark ? "#0f172a" : "#ffffff"
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-4 w-4 text-blue-400 fill-blue-400/20" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-4 w-4 text-orange-500 fill-orange-500/20" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    )
}

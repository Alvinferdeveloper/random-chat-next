"use client"

import { motion, useScroll, useSpring } from "framer-motion"

interface ScrollConnectorProps {
    sections: {
        id: string
        ref: React.RefObject<HTMLDivElement | null>
    }[]
}

export default function ScrollConnector({ sections }: ScrollConnectorProps) {
    const { scrollYProgress } = useScroll()

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const totalSections = sections.length

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <div className="relative h-[50vh] w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                <motion.div 
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#D6F045] via-emerald-500 to-emerald-600 rounded-full origin-top"
                    style={{ scaleY, height: "100%" }}
                />
            </div>
            
            {sections.map((section, index) => (
                <ScrollIndicator key={section.id} section={section} index={index} totalSections={totalSections} />
            ))}
        </div>
    )
}

function ScrollIndicator({ section, index, totalSections }: { section: { id: string; ref: React.RefObject<HTMLDivElement | null> }, index: number, totalSections: number }) {
    const { scrollYProgress } = useScroll({
        target: section.ref,
        offset: ["start end", "end start"]
    })

    const scale = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const isActive = scrollYProgress.get() > 0.2 && scrollYProgress.get() < 0.8

    return (
        <motion.div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-lg cursor-pointer transition-all ${
                isActive ? "bg-[#D6F045] scale-125" : "bg-gray-400 dark:bg-gray-600"
            }`}
            style={{ top: `${(index + 1) * (100 / (totalSections + 1))}%` }}
            onClick={() => {
                section.ref.current?.scrollIntoView({ behavior: "smooth" })
            }}
            whileHover={{ scale: 1.5 }}
        />
    )
}

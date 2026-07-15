'use client'

import Image from "next/image";
import { forwardRef } from "react";
import Reveal from "@/src/app/(main)/components/Reveal";
import { useTranslation } from '@/src/app/lib/i18n'
import { Trans } from 'react-i18next'

const FeaturesSection = forwardRef<HTMLDivElement>((props, ref) => {
    const { t } = useTranslation()

    const featureList = [
        {
            illustration: "/illustrations/themes.jpg",
            title: t('landing.features.item_1_title'),
            description: t('landing.features.item_1_desc'),
            tag: t('landing.features.tag_explore')
        },
        {
            illustration: "/illustrations/connection.svg",
            title: t('landing.features.item_2_title'),
            description: t('landing.features.item_2_desc'),
            tag: t('landing.features.tag_community')
        },
        {
            illustration: "/illustrations/security.jpg",
            title: t('landing.features.item_3_title'),
            description: t('landing.features.item_3_desc'),
            tag: t('landing.features.tag_privacy')
        },
    ]

    return (
        <section id="como-funciona" ref={ref} className="py-20 md:py-32  overflow-hidden">
            <div className="container px-4 mx-auto md:px-6">

                <Reveal direction="up" delay={0.1}>
                    <div className="flex flex-col items-center max-w-4xl mx-auto text-center mb-20 md:mb-32">
                        <span className="flex items-center px-5 py-2 mb-8 text-sm font-bold tracking-wide text-emerald-950 uppercase bg-[#D6F045] rounded-full shadow-sm cursor-default">
                            {t('landing.features.badge')}
                        </span>

                        <h2 className="text-5xl font-black tracking-tighter text-gray-900 md:text-6xl lg:text-7xl dark:text-white leading-[1.1]">
                            {t('landing.features.heading_discover')}<br className="hidden sm:block" />
                            <span className="relative inline-block mt-2 sm:mt-4">
                                <span className="relative z-10 text-emerald-900 dark:text-emerald-400">{t('landing.features.heading_share')}</span>
                                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-4 md:h-6 bg-[#D6F045] -z-10 rounded-sm transform -rotate-1 opacity-90"></span>
                            </span>
                        </h2>

                        <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            <Trans i18nKey="landing.features.description" components={{ bold: <span className="font-semibold text-emerald-700 dark:text-emerald-400" /> }} />
                        </p>
                    </div>
                </Reveal>

                <div className="flex flex-col gap-24 md:gap-40 max-w-7xl mx-auto">
                    {featureList.map((feature, index) => (
                        <Reveal key={index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.2}>
                            <div
                                className={`flex flex-col gap-12 lg:gap-20 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                <div className="w-full md:w-1/2 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D6F045] to-emerald-400 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0"></div>

                                    <div className="relative z-10 aspect-square md:aspect-[4/3] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/60 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={feature.illustration}
                                                alt={feature.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1B3C35] text-[#D6F045] font-bold text-xl shadow-lg shadow-emerald-900/20">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                                            {feature.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                                        {feature.description}
                                    </p>

                                    <a href="#" className="inline-flex items-center text-lg font-bold text-[#1B3C35] dark:text-[#D6F045] hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors w-fit group/link">
                                        {t('landing.features.link_text')}
                                        <svg className="w-6 h-6 ml-2 transform transition-transform group-hover/link:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </section>
    );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;

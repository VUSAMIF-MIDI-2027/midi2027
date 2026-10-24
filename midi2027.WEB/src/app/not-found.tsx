"use client";

import midiCat_NotFound from "../../public/midiCat_NotFound.webp"
import Image from "next/image"
import Link from "next/link"
import { text } from "@/app/not-foundText"
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
    const { lang } = useLanguage();
    const t = text[lang];
    
    return (
        <div className="flex min-h-[calc(100vh-4.25rem)] flex-col">
            <div className="flex flex-1 items-center justify-between px-12 max-[700px]:flex-col max-[700px]:justify-center max-[700px]:gap-12">

                <Image
                    src={midiCat_NotFound}
                    alt="MIDI construction cat"
                    loading="eager"
                    className="w-96 h-auto max-[920px]:w-72 max-[700px]:w-64"
                />

                <div>
                    <h1 className="font-extrabold text-7xl text-[#0075b5] max-[920px]:text-6xl max-[820px]:text-5xl max-[440px]:text-4xl text-right">
                        {t.titleTop}
                    </h1>

                    <h1 className="font-extrabold text-7xl text-[#404041] max-[920px]:text-6xl max-[820px]:text-5xl max-[440px]:text-4xl text-right">
                        {t.titleBottom}
                    </h1>

                    <p className="font-regular text-[#404041]/70 text-right">
                        {t.subTitle}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0075b5] transition-all duration-200 hover:gap-4 outline-2 outline-offset-6 outline-dotted rounded-lg"
                        >
                            {t.backHome}
                            <span className="relative -top-px inline-block leading-none transition-transform duration-200 group-hover:translate-x-2">
                                →
                            </span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
"use client";

import logoMidiWhite from "../../public/logos/MIDI-Logotipas-baltas.png";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { text } from "@/app/pageText";
import { useLanguage } from "@/context/LanguageContext";
import { Typewriter } from "@/compoments/Typerwriter";
import { Countdown } from "@/compoments/CountdownTimer";
import Link from "next/link";
import About from "@/compoments/Home/About";
import { LatestFeed } from "@/compoments/Home/LatestFeed";

export default function Home() {

    const { lang } = useLanguage();
    const t = text[lang];
    return (
        <>
            <div className="relative min-h-200 max-[700px]:min-h-200 overflow-hidden bg-[#0075b5]">
                <div
                    className="
          pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(180px,28vw,380px)] font-extrabold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)]
          "
                >
                    MIDI
                </div>
                <div
                    className="
          pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.08)_0%,transparent_65%)]
          "
                />
                <div className="relative w-full max-w-160 py-8 text-center max-[1130px]:mx-auto">
                    <Image
                        src={logoMidiWhite}
                        alt="MIDI - Matematikų ir Informatikų Dienos"
                        loading="eager"
                        className="
              mx-auto mb-8 h-auto w-[clamp(100px,16vw,180px)] object-contain"
                    />
                </div>
                <div className="relative z-10 w-full px-8 text-center">
                    <h1 className="text-5xl font-bold text-white">
                        {t.titleTop}
                    </h1>

                    <div className="flex min-h-7 py-4 items-center justify-center">
                        <p className="text-xl text-white/65">
                            <Typewriter text={t.subTitle} />
                        </p>
                    </div>

                    <div className="py-10">
                        <Countdown
                            targetDate="2027-04-10T00:00:00+03:00"
                            labels={{
                                days: t.days,
                                hours: t.hours,
                                minutes: t.minutes,
                                seconds: t.seconds,
                            }}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 py-6 sm:flex-row">
                        <a
                            href="https://forms.gle/v9x3FRXbMZdov5op6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-main-btn inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-white px-6 py-4 text-lg font-bold text-[#0075b5] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
                        >
                            {t.volunteerButton}<ArrowUpRight size={20} className="shrink-0" aria-hidden="true" />
                        </a>
                        <Link
                            href="/contacts"
                            className="cta-main-btn cta-main-btn--alternate inline-flex min-h-14 w-full items-center justify-center rounded-md border border-white/60 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
                        >
                            {t.mainButton}
                        </Link>
                    </div>
                    <div className="flex min-h-7 py-4 items-center justify-center">
                        <p className="text-lg font-bold text-white/30 tracking-widest">
                            {t.bottomSubTitle}
                        </p>
                    </div>
                </div>
            </div>

            <About />
            <LatestFeed />
            <section className="bg-[#0075b5] px-6 py-14 text-white sm:px-12" aria-labelledby="updates-title">
                <div className="mx-auto max-w-[1100px]">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">{t.updates.label}</p>
                    <h2 id="updates-title" className="mt-4 text-3xl font-extrabold sm:text-4xl">{t.updates.title}</h2>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{t.updates.description}</p>
                    <Link href="/contacts" className="mt-6 inline-flex rounded-md bg-white px-6 py-3 font-bold text-[#0075b5] hover:bg-white/90">{t.updates.button} <span aria-hidden="true" className="ml-3">→</span></Link>
                </div>
            </section>
        </>
    );
}

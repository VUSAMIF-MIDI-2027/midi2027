"use client";

import Image from "next/image";
import styles from "./UpcomingEvent.module.css";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { upcomingEvent, upcomingEventText } from "./UpcomingEventText";

export default function UpcomingEvent() {
    const { lang } = useLanguage();
    const t = upcomingEventText[lang];

    if (!upcomingEvent.enabled) return null;

    return (
        <section
            id={upcomingEvent.id}
            aria-labelledby="upcoming-section-title"
            className={`${styles.section} scroll-mt-17`}
        >
            <div className={styles.sectionHeading}>
                <h2 id="upcoming-section-title">{t.label}</h2>
            </div>
            <article className={styles.layout} aria-labelledby="upcoming-event-title">
                <div className={styles.artwork}>
                    <picture className={styles.picture}>
                        <source
                            media="(max-width: 639px)"
                            srcSet={upcomingEvent.mobileBanner}
                            width={1122}
                            height={1402}
                        />
                        <Image
                            src={upcomingEvent.banner}
                            alt={t.bannerAlt}
                            width={1920}
                            height={1005}
                            sizes="(min-width: 1703px) 880px, (min-width: 1024px) 52vw, 94vw"
                            className={styles.banner}
                        />
                    </picture>
                </div>

                <div className={styles.content}>
                    <div>
                        <h3 id="upcoming-event-title" className="text-[clamp(2.75rem,4.5vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
                            {t.title}
                        </h3>
                        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-base font-semibold text-white/90">
                            <li className="inline-flex items-center gap-2">
                                <CalendarDays size={18} className="shrink-0 text-white/60" aria-hidden="true" />
                                <time dateTime={upcomingEvent.startsAt}>{t.date}</time>
                            </li>
                            <li className="inline-flex items-center gap-2">
                                <Clock3 size={18} className="shrink-0 text-white/60" aria-hidden="true" />
                                <span>{t.time}</span>
                            </li>
                            <li className="inline-flex items-center gap-2">
                                <MapPin size={18} className="shrink-0 text-white/60" aria-hidden="true" />
                                <span>{t.location}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="mt-8 space-y-4 text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                            {t.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <a
                                href={upcomingEvent.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-[#262626] transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                {t.register}<ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                            <a
                                href={upcomingEvent.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/25 px-5 py-3 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                {t.facebook}<ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { upcomingEvent, upcomingEventText } from "@/compoments/Home/UpcomingEventText";

// A real exported page keeps this short URL working on static hosting.
export default function NightWithMidiPage() {
    const router = useRouter();
    const { lang } = useLanguage();
    const destination = upcomingEvent.enabled ? `/#${upcomingEvent.id}` : "/";

    useEffect(() => {
        router.replace(destination);
    }, [router, destination]);

    return (
        <div className="px-6 py-24 text-center">
            <a href={destination} className="text-xl font-bold text-[#0075b5] underline underline-offset-4">
                {upcomingEventText[lang].title} →
            </a>
        </div>
    );
}

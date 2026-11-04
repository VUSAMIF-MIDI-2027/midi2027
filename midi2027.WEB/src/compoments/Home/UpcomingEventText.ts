import type { Lang } from "@/context/LanguageContext";

type UpcomingEventText = {
    label: string;
    title: string;
    date: string;
    time: string;
    location: string;
    paragraphs: readonly string[];
    register: string;
    facebook: string;
    bannerAlt: string;
};

export const upcomingEvent = {
    // false hides the entire section. Rebuild and deploy to update the live site.
    enabled: true,
    id: "naktis-su-midi",
    startsAt: "2026-11-27T19:30:00+02:00",
    registrationUrl: "https://forms.cloud.microsoft/e/F8rifT8KHV",
    facebookUrl: "https://www.facebook.com/share/19vv4pm6mj/?mibextid=wwXIfr",
    banner: "/events/naktis-su-midi.webp",
    mobileBanner: "/events/naktis-su-midi-mobile.webp",
} as const;

export const upcomingEventText: Record<Lang, UpcomingEventText> = {
    lt: {
        label: "Artėjantys renginiai",
        title: "Naktis su MIDI",
        date: "Lapkričio 27 d.",
        time: "19:30",
        location: "Didlaukio g. 47",
        paragraphs: [
            "Nežinai ką veikti š.m. lapkričio mėnesį? Prisijunk prie mūsų ir vieną dieną bei naktį smagiai praleisk kartu su MIDI! 🌙",
            "Nieko nelauk – griebk draugus, pranešk kursiokams ir susimatome lapkričio 27 d., 19:30 Didlaukio g. 47! Nepamiršk geros energijos ir linksmos nuotaikos! 😼💙",
        ],
        register: "Registruotis",
        facebook: "Renginys Facebook",
        bannerAlt: "Naktis su MIDI – lapkričio 27 d., Didlaukio g. 47. Renginio plakatas su MIDI logotipu ir mėlynomis rodyklėmis.",
    },
    en: {
        label: "Upcoming events",
        title: "Night with MIDI",
        date: "November 27",
        time: "19:30",
        location: "Didlaukio g. 47",
        paragraphs: [
            "Got no plans for this year’s November? Join us and spend one extra fun day and night together with MIDI! 🌙",
            "Don’t wait – grab your friends, tell your course mates and see you on November 27th, 19:30 at Didlaukio g. 47! Don’t forget good energy and lively mood! 😼💙",
        ],
        register: "Register now",
        facebook: "Facebook event",
        bannerAlt: "Night with MIDI – November 27, Didlaukio g. 47. Event poster with the MIDI logo and blue arrows.",
    },
};

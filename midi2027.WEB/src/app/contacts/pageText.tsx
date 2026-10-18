import { Lang } from "@/context/LanguageContext";

type ContactCardText = { title: string; description: string; handle: string };
type FaqItem = { question: string; answer: string };

type ContactsPageText = {
  eyebrow: string;
  watermark: string;
  title: string;
  intro: string;
  channelsEyebrow: string;
  operaTitle: string;
  stats: Array<{ value: number; label: string }>;
  cards: Record<"email" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "operaInstagram" | "operaYoutube" | "operaFacebook", ContactCardText>;
  faq: { eyebrow: string; title: string; intro: string; items: FaqItem[] };
};

export const text: Record<Lang, ContactsPageText> = {
  en: {
    eyebrow: "Get in touch",
    watermark: "CONTACT",
    title: "Reach us however works for you.",
    intro: "Want to become a partner, sponsor, follow the news or just say hello? Pick the channel that suits you best.",
    channelsEyebrow: "MIDI social media",
    operaTitle: "MIDI Rock Opera",
    stats: [
      { value: 50, label: "Years of history" },
      { value: 20, label: "Events held" },
      { value: 5000, label: "Students reached" },
      { value: 100, label: "Partner companies" },
    ],
    cards: {
      operaInstagram: { title: "Rock Opera · Instagram", description: "Rehearsals, backstage moments and news from the MIDI Rock Opera.", handle: "@roko_operos" },
      operaYoutube: { title: "Rock Opera · YouTube", description: "Watch MIDI Rock Opera performances and videos.", handle: "@midirokooperos" },
      operaFacebook: { title: "Rock Opera · Facebook", description: "News and memories from the MIDI Rock Opera.", handle: "MIDI Roko opera" },
      email: { title: "Email us", description: "Best for formal enquiries, partnerships, and sponsorships.", handle: "marketingas@midi.lt" },
      instagram: { title: "Instagram", description: "Follow our updates, event highlights, and behind-the-scenes.", handle: "@midi.lt" },
      facebook: { title: "Facebook", description: "Event announcements and community discussions.", handle: "MIDI" },
      linkedin: { title: "LinkedIn", description: "Professional network — connect with our organisation.", handle: "MIDI" },
      tiktok: { title: "TikTok", description: "Watch short videos, event moments, and behind-the-scenes content.", handle: "@midi.lt" },
      youtube: { title: "YouTube · MIDI TV", description: "Watch videos and recordings from MIDI events.", handle: "@TheMiDiTV" },
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      intro: "Can't find what you're looking for? Email us directly.",
      items: [
        { question: "What is MIDI?", answer: "MIDI — Mathematics and Informatics Days — is an annual student event at Vilnius University's Faculty of Mathematics and Informatics, connecting students with industry, academia, and the broader tech community." },
        { question: "How can our company get involved?", answer: "There are several ways: sponsorship packages, speaking slots, workshop hosting, and career fair participation. Reach out via email and we will send you our partnership deck." },
        { question: "When does MIDI 2027 take place?", answer: "MIDI 2027 starts on 10 April 2027. The programme and individual event times will be announced on this website and our social channels." },
      { question: "Who organises MIDI?", answer: "MIDI is organised by VU SA MIF, the Students' Representation at the Faculty of Mathematics and Informatics of Vilnius University." },
        { question: "Is there a fee to participate?", answer: "Everyone can take part, whether or not they are a student. Some MIDI events are free, while others require a paid ticket. Prices and registration details will be listed with each event." },
      ],
    },
  },
  lt: {
    eyebrow: "Susisiekime",
    watermark: "KONTAKTAI",
    title: "Susisiekite jums patogiausiu būdu.",
    intro: "Norite tapti partneriu, rėmėju, sekti naujienas ar tiesiog pasisveikinti? Pasirinkite jums tinkamiausią kanalą.",
    channelsEyebrow: "MIDI socialiniai tinklai",
    operaTitle: "MIDI Roko opera",
    stats: [
      { value: 50, label: "Metų istorijos" },
      { value: 20, label: "Įvykusių renginių" },
      { value: 5000, label: "Pasiektų studentų" },
      { value: 100, label: "Įmonių partnerių" },
    ],
    cards: {
      operaInstagram: { title: "Roko opera · Instagram", description: "MIDI Roko operos repeticijos, užkulisiai ir naujienos.", handle: "@roko_operos" },
      operaYoutube: { title: "Roko opera · YouTube", description: "Žiūrėkite MIDI Roko operų pasirodymus ir vaizdo įrašus.", handle: "@midirokooperos" },
      operaFacebook: { title: "Roko opera · Facebook", description: "MIDI Roko operos naujienos ir prisiminimai.", handle: "MIDI Roko opera" },
      email: { title: "El. paštas", description: "Oficialioms užklausoms, partnerystėms ir rėmimo pasiūlymams.", handle: "marketingas@midi.lt" },
      instagram: { title: "Instagram", description: "Sekite naujienas, renginio akimirkas ir pasiruošimo užkulisius.", handle: "@midi.lt" },
      facebook: { title: "Facebook", description: "Renginių pranešimai ir bendruomenės diskusijos.", handle: "MIDI" },
      linkedin: { title: "LinkedIn", description: "Profesinis tinklas ir ryšys su mūsų organizacija.", handle: "MIDI" },
      tiktok: { title: "TikTok", description: "Žiūrėkite trumpus vaizdo įrašus, renginio akimirkas ir užkulisius.", handle: "@midi.lt" },
      youtube: { title: "YouTube · MIDI TV", description: "Žiūrėkite MIDI renginių vaizdo įrašus ir įrašus.", handle: "@TheMiDiTV" },
    },
    faq: {
      eyebrow: "DUK",
      title: "Dažniausiai užduodami klausimai",
      intro: "Neradote atsakymo? Parašykite mums el. paštu.",
      items: [
        { question: "Kas yra MIDI?", answer: "MIDI — Matematikų ir Informatikų Dienos — yra kasmetinis Vilniaus universiteto Matematikos ir informatikos fakulteto studentų renginys, jungiantis studentus, verslą, akademinę bendruomenę ir technologijų sektorių." },
        { question: "Kaip mūsų įmonė gali prisidėti?", answer: "Prisidėti galima remiant renginį, skaitant pranešimus, organizuojant dirbtuves ar dalyvaujant karjeros mugėje. Parašykite mums el. paštu ir atsiųsime partnerystės pasiūlymą." },
        { question: "Kada vyks MIDI 2027?", answer: "MIDI 2027 prasidės 2027 m. balandžio 10 d. Renginių programą ir atskirų renginių laikus paskelbsime svetainėje bei socialiniuose tinkluose." },
        { question: "Kas organizuoja MIDI?", answer: "MIDI organizuoja VU SA MIF – Vilniaus universiteto studentų atstovybė Matematikos ir informatikos fakultete." },
        { question: "Ar dalyvavimas mokamas?", answer: "Dalyvauti gali visi, ne tik studentai. Dalis MIDI renginių yra nemokami, o dalis – mokami. Kainas ir registracijos informaciją skelbsime prie kiekvieno renginio." },
      ],
    },
  },
};

import type { Locale } from "@/lib/i18n/config";

/**
 * Copy for the ad-funnel landing pages (/getquote, /learnmore), in both
 * languages. Kept out of the main dictionaries.ts so the funnels stay
 * self-contained; the active language is still resolved by the same host/cookie
 * mechanism (see lib/i18n/server.ts) and passed in as `locale`.
 */

interface Note {
  h3: string;
  p: string;
}
interface Row {
  num: string;
  h3: string;
  p: string;
}

export interface FunnelForm {
  heading: string;
  sub: string;
  name: string;
  address: string;
  service: string;
  servicePlaceholder: string;
  serviceOptions: string[];
  phone: string;
  email: string;
  consent: string;
  submit: string;
  sending: string;
  micro: string;
  successHeading: string;
  successBody: string;
  error: string;
}

export interface FunnelShared {
  phone: string;
  phoneHref: string;
  form: FunnelForm;
  footerTagline: string;
  footerInstagram: string;
  footerRights: string;
  before: string;
  after: string;
}

export interface LearnMoreCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  ctaLabel: string;
  ctaMicro: string;
  plainEyebrow: string;
  plainTitle: string;
  rows: Row[];
  baEyebrow: string;
  baTitle: string;
  quoteEyebrow: string;
  quoteTitle: string;
  quoteLede: string;
  notes: Note[];
}

export interface GetQuoteCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  ctaLabel: string;
  ctaMicro: string;
  baEyebrow: string;
  baTitle: string;
  visitEyebrow: string;
  visitTitle: string;
  trust: Note[];
  surfaces: string[];
  quoteEyebrow: string;
  quoteTitle: string;
  quoteLede: string;
  notes: Note[];
}

export interface FunnelCopy {
  shared: FunnelShared;
  learnmore: LearnMoreCopy;
  getquote: GetQuoteCopy;
}

const en: FunnelCopy = {
  shared: {
    phone: "(438) 813-5716",
    phoneHref: "tel:4388135716",
    form: {
      heading: "Get your free quote",
      sub: "About 2 minutes · no payment · reply within 24h",
      name: "Full name",
      address: "Home address",
      service: "Service wanted",
      servicePlaceholder: "Choose a service",
      serviceOptions: [
        "House exterior soft wash",
        "Driveway & walkway cleaning",
        "Patio cleaning",
        "Full property",
      ],
      phone: "Phone",
      email: "Email",
      consent:
        "I'd also like to receive seasonal reminders and offers from Beaumont by email. You can unsubscribe anytime. (Optional)",
      submit: "Get my quote",
      sending: "Sending…",
      micro: "Kept private · no exact measurements needed",
      successHeading: "Sent — we'll reply within 24h",
      successBody:
        "Thank you. Your request is with our team; we'll come back with your final price within 24 hours.",
      error:
        "We couldn't send your request just now. Please try again in a moment.",
    },
    footerTagline: "Concierge home care, quietly delivered.",
    footerInstagram: "Instagram · @groupebeaumont",
    footerRights: "© 2026 Beaumont · Greater Montréal",
    before: "Before",
    after: "After",
  },
  learnmore: {
    metaTitle: "What soft washing is — and why it lasts | Beaumont",
    metaDescription:
      "The green and black on your home is algae and mold. Watch how soft washing removes it at the root — and why it stays clean two to three times longer.",
    heroEyebrow: "Soft washing, explained",
    heroTitle:
      "The green on your home is alive. Here's what actually gets rid of it.",
    heroLede:
      "Four minutes. What algae and mold do to your property, why pressure washing keeps failing you, and how soft washing removes it at the root.",
    ctaLabel: "Get my quote",
    ctaMicro: "Two minutes · no visit required for most homes",
    plainEyebrow: "In plain terms",
    plainTitle: "What you just watched, without the footage.",
    rows: [
      {
        num: "01",
        h3: "The problem is alive.",
        p: "The green and black on your exterior, walkways, and patio is algae and mold. It feeds on the surface and holds moisture against your home. Pressure removes what's on top — the roots survive, and it's back within the year.",
      },
      {
        num: "02",
        h3: "The method is gentle.",
        p: "We apply a cleaning solution at low pressure — about the strength of a garden hose. It kills the algae and mold at the root. We let it work, then rinse. On walkways and driveways, we finish with a surface cleaner for an even result, edge to edge.",
      },
      {
        num: "03",
        h3: "The clean lasts.",
        p: "Because the growth is dead, not just knocked off, your property stays clean two to three times longer than any pressure wash. Nothing forced behind your exterior, nothing stripped.",
      },
    ],
    baEyebrow: "Before / After",
    baTitle: "Same property. Same day.",
    quoteEyebrow: "Free quote",
    quoteTitle: "If you want it done, we do it.",
    quoteLede:
      "We soft wash homes across Greater Montréal — quietly, carefully, and exactly as quoted.",
    notes: [
      {
        h3: "We document first.",
        p: "Photos of your property before we touch anything. You know exactly what condition it was in, and so do we.",
      },
      {
        h3: "The price is the price.",
        p: "Your quote is your final price. No add-ons at the door, no surprises after.",
      },
      {
        h3: "We leave you be.",
        p: "You don't need to be home. We use your outdoor spigot, do the work, and send before-and-after photos when it's done.",
      },
    ],
  },
  getquote: {
    metaTitle: "Soft washing. The clean that lasts. | Beaumont",
    metaDescription:
      "Low pressure. A treatment that kills algae and mold at the source. A property that stays clean instead of turning green again next spring. Get your quote in two minutes.",
    heroEyebrow: "Soft washing · Greater Montréal",
    heroTitle: "Soft washing. The clean that lasts.",
    heroLede:
      "Low pressure. A treatment that kills algae and mold at the source. A property that stays clean instead of turning green again next spring.",
    ctaLabel: "Get my quote",
    ctaMicro: "Two minutes · no visit required for most homes",
    baEyebrow: "Before / After",
    baTitle: "Same property. Same day.",
    visitEyebrow: "How a visit runs",
    visitTitle: "Quiet service. Exacting care.",
    trust: [
      {
        h3: "We document first.",
        p: "Photos of your property before we touch anything. You know exactly what condition it was in, and so do we.",
      },
      {
        h3: "The price is the price.",
        p: "Your quote is your final price. No add-ons at the door, no surprises after.",
      },
      {
        h3: "We leave you be.",
        p: "You don't need to be home. We use your outdoor spigot, do the work, and send before-and-after photos the day it's done.",
      },
    ],
    surfaces: [
      "Vinyl",
      "Brick",
      "Aluminum",
      "Concrete",
      "Pavers",
      "Composite",
    ],
    quoteEyebrow: "Free quote",
    quoteTitle: "See your home the way it was meant to look.",
    quoteLede:
      "Tell us where the property is and what needs care. We reply within 24 hours with your final price.",
    notes: [
      {
        h3: "We document first.",
        p: "Photos of your property before we touch anything. You know exactly what condition it was in, and so do we.",
      },
      {
        h3: "The price is the price.",
        p: "Your quote is your final price. No add-ons at the door, no surprises after.",
      },
      {
        h3: "We leave you be.",
        p: "You don't need to be home. We use your outdoor spigot, do the work, and send before-and-after photos when it's done.",
      },
    ],
  },
};

const fr: FunnelCopy = {
  shared: {
    phone: "(438) 813-5716",
    phoneHref: "tel:4388135716",
    form: {
      heading: "Obtenez votre soumission gratuite",
      sub: "Environ 2 minutes · aucun paiement · réponse en 24 h",
      name: "Nom complet",
      address: "Adresse de la maison",
      service: "Service souhaité",
      servicePlaceholder: "Choisissez un service",
      serviceOptions: [
        "Lavage doux de l'extérieur de la maison",
        "Nettoyage d'entrée et de trottoir",
        "Nettoyage de patio",
        "Propriété complète",
      ],
      phone: "Téléphone",
      email: "Courriel",
      consent:
        "J'aimerais aussi recevoir les rappels saisonniers et les offres de Beaumont par courriel. Vous pouvez vous désabonner en tout temps. (Facultatif)",
      submit: "Obtenir ma soumission",
      sending: "Envoi…",
      micro: "Gardé privé · aucune mesure exacte requise",
      successHeading: "Envoyé — réponse en 24 h",
      successBody:
        "Merci. Votre demande est entre les mains de notre équipe; nous revenons vers vous avec votre prix final en moins de 24 heures.",
      error:
        "Nous n'avons pas pu envoyer votre demande pour l'instant. Veuillez réessayer dans un moment.",
    },
    footerTagline: "Le soin de la maison, livré en toute discrétion.",
    footerInstagram: "Instagram · @groupebeaumont",
    footerRights: "© 2026 Beaumont · Grand Montréal",
    before: "Avant",
    after: "Après",
  },
  learnmore: {
    metaTitle: "Ce qu'est le lavage doux — et pourquoi ça dure | Beaumont",
    metaDescription:
      "Le vert et le noir sur votre maison, c'est des algues et de la moisissure. Voyez comment le lavage doux les élimine à la racine — et pourquoi ça reste propre deux à trois fois plus longtemps.",
    heroEyebrow: "Le lavage doux, expliqué",
    heroTitle:
      "Le vert sur votre maison est vivant. Voici ce qui l'élimine pour vrai.",
    heroLede:
      "Quatre minutes. Ce que les algues et la moisissure font à votre propriété, pourquoi le lavage à pression vous laisse tomber chaque année, et comment le lavage doux les élimine à la racine.",
    ctaLabel: "Obtenir ma soumission",
    ctaMicro: "Deux minutes · aucune visite requise pour la plupart des maisons",
    plainEyebrow: "En termes simples",
    plainTitle: "Ce que vous venez de voir, sans les images.",
    rows: [
      {
        num: "01",
        h3: "Le problème est vivant.",
        p: "Le vert et le noir sur votre revêtement, vos trottoirs et votre patio, c'est des algues et de la moisissure. Ça se nourrit de la surface et ça garde l'humidité contre votre maison. La pression enlève le dessus — les racines survivent, et ça revient dans l'année.",
      },
      {
        num: "02",
        h3: "La méthode est douce.",
        p: "On applique une solution nettoyante à basse pression — à peu près la force d'un boyau d'arrosage. Elle élimine les algues et la moisissure à la racine. On laisse agir, ensuite on rince. Sur les trottoirs et les entrées, on termine avec un nettoyeur de surface pour un résultat uniforme, d'un bord à l'autre.",
      },
      {
        num: "03",
        h3: "La propreté dure.",
        p: "Parce que la croissance est morte, pas juste décollée, votre propriété reste propre deux à trois fois plus longtemps que n'importe quel lavage à pression. Rien n'est poussé derrière le revêtement, rien n'est abîmé.",
      },
    ],
    baEyebrow: "Avant / Après",
    baTitle: "Même propriété. Même journée.",
    quoteEyebrow: "Soumission gratuite",
    quoteTitle: "Si vous voulez le faire faire, on le fait.",
    quoteLede:
      "On lave des maisons partout dans le Grand Montréal — discrètement, soigneusement, et exactement au prix soumis.",
    notes: [
      {
        h3: "On documente d'abord.",
        p: "Des photos de votre propriété avant de toucher à quoi que ce soit. Vous savez exactement dans quel état elle était, et nous aussi.",
      },
      {
        h3: "Le prix, c'est le prix.",
        p: "Votre soumission est votre prix final. Pas d'extras à la porte, pas de surprises après.",
      },
      {
        h3: "On vous laisse tranquille.",
        p: "Pas besoin d'être à la maison. On utilise votre robinet extérieur, on fait le travail, et on vous envoie les photos avant-après une fois terminé.",
      },
    ],
  },
  getquote: {
    metaTitle: "Le lavage doux. Le propre qui dure. | Beaumont",
    metaDescription:
      "Basse pression. Un traitement qui élimine les algues et la moisissure à la source. Une propriété qui reste propre au lieu de reverdir au printemps. Obtenez votre soumission en deux minutes.",
    heroEyebrow: "Lavage doux · Grand Montréal",
    heroTitle: "Le lavage doux. Le propre qui dure.",
    heroLede:
      "Basse pression. Un traitement qui élimine les algues et la moisissure à la source. Une propriété qui reste propre au lieu de reverdir au printemps.",
    ctaLabel: "Obtenir ma soumission",
    ctaMicro: "Deux minutes · aucune visite requise pour la plupart des maisons",
    baEyebrow: "Avant / Après",
    baTitle: "Même propriété. Même journée.",
    visitEyebrow: "Comment se déroule une visite",
    visitTitle: "Un service discret. Un soin rigoureux.",
    trust: [
      {
        h3: "On documente d'abord.",
        p: "Des photos de votre propriété avant de toucher à quoi que ce soit. Vous savez exactement dans quel état elle était, et nous aussi.",
      },
      {
        h3: "Le prix, c'est le prix.",
        p: "Votre soumission est votre prix final. Pas d'extras à la porte, pas de surprises après.",
      },
      {
        h3: "On vous laisse tranquille.",
        p: "Pas besoin d'être à la maison. On utilise votre robinet extérieur, on fait le travail, et on vous envoie les photos avant-après le jour même.",
      },
    ],
    surfaces: [
      "Vinyle",
      "Brique",
      "Aluminium",
      "Béton",
      "Pavés",
      "Composite",
    ],
    quoteEyebrow: "Soumission gratuite",
    quoteTitle: "Retrouvez votre maison telle qu'elle devrait paraître.",
    quoteLede:
      "Dites-nous où se trouve la propriété et ce qui a besoin de soin. On répond en 24 heures avec votre prix final.",
    notes: [
      {
        h3: "On documente d'abord.",
        p: "Des photos de votre propriété avant de toucher à quoi que ce soit. Vous savez exactement dans quel état elle était, et nous aussi.",
      },
      {
        h3: "Le prix, c'est le prix.",
        p: "Votre soumission est votre prix final. Pas d'extras à la porte, pas de surprises après.",
      },
      {
        h3: "On vous laisse tranquille.",
        p: "Pas besoin d'être à la maison. On utilise votre robinet extérieur, on fait le travail, et on vous envoie les photos une fois terminé.",
      },
    ],
  },
};

const dictionaries: Record<Locale, FunnelCopy> = { en, fr };

export function getFunnelCopy(locale: Locale): FunnelCopy {
  return dictionaries[locale];
}

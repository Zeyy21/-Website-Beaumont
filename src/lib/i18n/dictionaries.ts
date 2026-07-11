import type { Locale } from "./config";

/**
 * Localized copy for the whole app. `en` is the source of truth and defines the
 * shape (`Dictionary = typeof en`); `fr` (Québec French) must match it key for
 * key — a missing or extra key is a TypeScript error, which is the safety net
 * that keeps the two languages in sync.
 *
 * Service ids, prices, brand name, emails, phone, and Instagram handle are NOT
 * here — they live in src/lib/config.ts and are language-neutral. Only the
 * human-readable labels keyed by stable id are localized below.
 */

const en = {
  statuses: {
    draft: "Draft",
    requested: "Requested",
    sent: "Sent",
    accepted: "Accepted",
    scheduled: "Scheduled",
    completed: "Completed",
    awaiting: "Awaiting",
    paid: "Paid",
    refunded: "Refunded",
    signed: "Signed",
  },

  common: {
    montreal: "Greater Montréal",
    brandSuffix: "· Admin",
    notProvided: "Not provided",
    notRecorded: "Not recorded",
    notSelected: "Not selected",
    notSet: "Not set",
    notAvailable: "Not available",
    none: "None",
    optional: "Optional",
    edit: "Edit",
    save: "Save",
    saving: "Saving…",
    saved: "Saved ✓",
    open: "Open",
    back: "Back",
    home: "Home",
    language: "Language",
    signIn: "Sign in",
    oneMoment: "One moment…",
  },

  nav: {
    services: "Services",
    about: "Who We Are",
    quote: "Free Quote",
    terms: "Terms",
    partners: "Partners",
    hiring: "Hiring",
  },

  site: {
    tagline: "Concierge home care, quietly delivered.",
    description:
      "Beaumont provides professional exterior cleaning for pressure washing, soft washing, and window care across Greater Montreal.",
    promise: "A brighter arrival, quietly delivered.",
  },

  services: {
    driveway: {
      name: "Driveway & Hardscape Washing",
      description:
        "Driveways, walkways, patios, and steps — oil, moss, and a winter's worth of salt, lifted evenly, edge to edge.",
    },
    deck: {
      name: "Deck & Fence Washing",
      description:
        "Wood and composite, washed gently enough to protect the grain and the stain — ready for the season, or ready for refinishing.",
    },
    "house-wash": {
      name: "House & Siding Soft Wash",
      description:
        "Vinyl, brick, and stucco cleaned at low pressure with the right solution — algae and grime gone, without damaging the surface.",
    },
    "windows-atlantic": {
      name: "Window Care",
      description:
        "Interior and exterior window cleaning through our specialist partners — booked in the same visit, held to the same standard.",
    },
  },

  frequencies: {
    one_time: { label: "One-time", note: "A single visit" },
    monthly: { label: "Seasonal", note: "A planned seasonal refresh" },
    biweekly: { label: "Twice yearly", note: "Spring and fall, most popular" },
    weekly: { label: "Annual", note: "A yearly restoration" },
  },

  addOns: {
    gutters: "Gutter Cleaning",
    "stain-review": "Oil, rust, or algae spot review",
  },

  hero: {
    eyebrowA: "Concierge home care",
    eyebrowB: "Quietly delivered",
    titleA: "Pressure Washing, Soft Washing,",
    titleB: "and Window Care for homes across Greater Montréal",
    body: "See your home the way it was meant to look.",
    ctaPrimary: "Get your free quote",
    ctaSecondary: "Our approach",
    scrollNote: "A considered approach to exterior care",
    imageAlt: "Pale stone Montreal home with a restored interlocking driveway",
  },

  principles: {
    sectionLabel: "Beaumont service principles",
    a: { title: "Material-aware", copy: "A method selected for every surface." },
    b: {
      title: "Quietly managed",
      copy: "You'll know when we're coming. You won't need to do anything when we're there.",
    },
    c: {
      title: "Effortless to arrange",
      copy: "Request the right exterior care in one place.",
    },
  },

  servicesSection: {
    eyebrow: "Services",
    intro:
      "Pressure washing, soft washing, and specialist window care, the right method for every surface of your home.",
    titleA: "Every exterior surface.",
    titleB: "One standard of care.",
    service: "Service",
    details: {
      driveways: "Driveways & stone",
      decks: "Decks & patios",
      houses: "House exteriors",
      windows: "Specialist window care",
    },
    types: {
      pressure: "Pressure washing",
      soft: "Soft washing",
      windows: "Exterior window cleaning",
    },
  },

  approach: {
    eyebrow: "Who we are",
    titleA: "Quiet service.",
    titleB: "Exacting care.",
    intro:
      "Beaumont is exterior care without the noise — no guesswork, no upselling at the door, no mess left behind. Every visit runs the same way: confirmed in advance, done carefully, walked through with you at the end.",
    imageCaption: "Material-aware exterior care",
    imageAlt:
      "A Beaumont technician cleaning exterior decking beside a Montreal home",
    chapters: {
      arrival: {
        eyebrow: "Arrival",
        title: "Prepared before we start.",
        copy: "We confirm what's being cleaned, pre-treat and protect your plants and fixtures, and choose the right treatment — before any water touches stone.",
      },
      work: {
        eyebrow: "The work",
        title: "Pressure, precisely applied.",
        copy: "Concrete, pavers, natural stone, and siding each get the method the material calls for — high pressure where it belongs, a gentle soft wash where it doesn't. Never one setting for everything.",
      },
      return: {
        eyebrow: "03 — THE WALKTHROUGH",
        title: "Finished together.",
        copy: "We walk the property with you before we leave — every surface checked, every corner rinsed, nothing left for you to inspect alone.",
      },
    },
  },

  testimonialSection: {
    sectionLabel: "Client testimonial",
    clientNote: "Client note",
    quote:
      "It made the whole house look newer. The property simply felt cared for again.",
    attribution: "Eleanor V. · Beaumont client",
  },

  quoteCta: {
    eyebrow: "Free estimate",
    titleA: "Your property. Your care.",
    titleB: "One reviewed quote.",
    body: "Select your address, choose the exterior services you need, and send the scope for review — in a few quiet steps.",
    featureNoPayment: "No payment to request",
    featureWritten: "A written quote within 24 hours",
    button: "Get your free quote",
    sub: "Takes about 2 minutes · no payment required",
  },

  /** Reusable calls to action placed through the page to keep the quote one
   *  tap away. All route to /quote. */
  cta: {
    band: {
      eyebrow: "Ready when you are",
      title: "See what Beaumont would do for your home.",
      button: "Get your free quote",
    },
    process: {
      text: "Like how that sounds? Start with your address.",
      button: "Request your quote",
    },
    sticky: {
      label: "Free quote · 24h reply",
      button: "Get a quote",
    },
  },

  contact: {
    eyebrow: "Contact",
    titleA: "Prefer a conversation?",
    titleB: "We’re here.",
    body: "For questions, property details, or a more tailored scope, reach us directly. We reply with clarity and without pressure.",
    emailLabel: "Email Beaumont",
    followLabel: "Follow our work",
    hours: "Monday–Saturday · Online estimates anytime",
  },

  partners: {
    title: "Our Partners",
    intro:
      "We work with specialized partners to provide comprehensive exterior care for your home.",
    quickCleanDescription:
      "Specialists in window washing, spider treatments, and condo window washing. QuickClean ensures your property's delicate surfaces are treated with the utmost care and professionalism.",
    atlanticDescription:
      "Specialists in window and gutter cleaning, as well as soffits and garage doors. Atlantic brings years of experience restoring homes to their best condition.",
  },

  hiring: {
    homeEyebrow: "Build with Beaumont",
    homeTitleA: "Good work.",
    homeTitleB: "Real momentum.",
    homeBody:
      "Join a team that values discipline, clear communication, and work you can be proud to put your name on.",
    techniciansLabel: "For technicians",
    techniciansTitle: "Master a craft outdoors.",
    techniciansBody:
      "Learn material-aware exterior care, deliver exacting work, and grow with a team that respects the details.",
    repsLabel: "For sales representatives",
    repsTitle: "Turn people skills into a career asset.",
    repsBody:
      "Build confidence, communication, and a repeatable sales skill set with support from people who want you to win.",
    exploreRole: "Explore this role",
    page: {
      metaTitle: "Hiring",
      metaDescription:
        "Explore technician and sales representative opportunities with Beaumont in Greater Montréal.",
      eyebrow: "Careers at Beaumont",
      titleA: "Work that builds",
      titleB: "more than a résumé.",
      intro:
        "We are building a focused team across Greater Montréal—people who care about the quality of their work, the way they communicate, and the skills they carry forward.",
      principlesLabel: "What you can expect",
      principleOneTitle: "Standards you can see",
      principleOneBody:
        "Clear expectations, thoughtful training, and work completed with care from arrival to final walkthrough.",
      principleTwoTitle: "Skills that compound",
      principleTwoBody:
        "Practical coaching in service, communication, responsibility, and problem-solving—useful here and everywhere after.",
      principleThreeTitle: "Room to earn and grow",
      principleThreeBody:
        "Performance is noticed. Initiative, consistency, and leadership create a path to greater responsibility.",
      techniciansEyebrow: "Field team",
      techniciansTitle: "Exterior Care Technicians",
      techniciansIntro:
        "For people who like tangible results, active days, and becoming excellent at a hands-on craft.",
      techniciansPointOne: "Learn safe pressure-washing and soft-washing methods",
      techniciansPointTwo: "Work with a detail-focused crew across Greater Montréal",
      techniciansPointThree: "Build customer-service, planning, and field leadership skills",
      techniciansFitTitle: "You may be a fit if",
      techniciansFitBody:
        "You are dependable, comfortable working outdoors, attentive to details, and willing to learn a careful process. Experience is welcome, but character and consistency matter most.",
      techniciansCta: "Apply as a technician",
      repsEyebrow: "Growth team",
      repsTitle: "Sales Representatives",
      repsIntro:
        "For driven communicators—including athletes—who want flexible earning potential and a skill they can use for life.",
      partnershipLabel: "Athlete pathway",
      partnershipTitle: "In partnership with PROTOTYPE SPORTS GROUP",
      partnershipBody:
        "Through our partnership with PROTOTYPE SPORTS GROUP, we hire athletes and help them fund their careers while developing durable skills in communication, relationship-building, discipline, and sales. These are skills they can use throughout their athletic journey and for the rest of their lives.",
      repsPointOne: "Learn a clear, ethical, repeatable sales process",
      repsPointTwo: "Develop confidence in outreach and real conversations",
      repsPointThree: "Create flexible income while building long-term career skills",
      repsCta: "Apply as a sales representative",
      emailNote: "Tell us a little about yourself and why this role interests you.",
    },
  },

  quoteThankYou: {
    metaTitle: "Thank you",
    metaDescription: "Your Beaumont quote request has been received.",
    eyebrow: "Request received",
    titleA: "Thank you.",
    titleB: "Your home is in good hands.",
    body:
      "Your request is safely with Beaumont. A specialist will review the property, services, and details you shared before preparing your written quote.",
    nextLabel: "What happens next",
    stepOneTitle: "We review the scope",
    stepOneBody: "A real person checks the services, surfaces, access, and notes you provided.",
    stepTwoTitle: "We prepare your quote",
    stepTwoBody: "You receive clear, written pricing—usually within 24 hours.",
    stepThreeTitle: "You decide",
    stepThreeBody: "There is no payment now and no pressure to proceed.",
    notificationSent: "A confirmation has also been sent to your email.",
    notificationSaved: "Your request is saved. Our team will follow up directly.",
    viewQuotes: "View my quotes",
    returnHome: "Return home",
    support: "Need to add something? Email our concierge team.",
  },

  terms: {
    title: "Terms",
    body: "Estimates are confirmed after Beaumont reviews the selected services, access, weather, and surface condition. No payment is taken when requesting an estimate.",
    pageTitle: "Terms & Conditions",
    intro:
      "Clear expectations, careful preparation, and no hidden fees. Here is how we operate.",
    estimatesTitle: "Estimates & Quotes",
    estimatesBodyA:
      "Estimates are confirmed after Beaumont reviews the selected services, access, weather, and surface condition. The price you see is the price you pay.",
    estimatesBodyB:
      "No payment is taken when requesting an estimate. We provide clear, itemized pricing before any work begins, ensuring complete transparency.",
    executionTitle: "Service Execution",
    executionBodyA:
      "Every visit runs the same way: confirmed in advance, done carefully, and walked through with you at the end.",
    executionBodyB:
      "We use specialized techniques including soft washing for delicate surfaces like vinyl and stucco, and high-pressure washing for concrete and driveways.",
    cancellationsTitle: "Cancellations",
    cancellationsBody:
      "We understand that plans change. If you need to reschedule or cancel your appointment, we simply ask that you provide us with at least 48 hours notice.",
  },

  header: {
    homeAria: "home",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    account: "Account",
    signIn: "Sign in",
    freeEstimate: "Free Quote",
    toggleMenu: "Toggle menu",
    quote: "Quote",
  },

  footer: {
    beginEstimate: "Get your free quote",
    explore: "Explore",
    contact: "Contact",
    clientSignIn: "Client sign in",
    termsLink: "Terms & Conditions",
  },

  auth: {
    metaTitle: "Sign in",
    metaDescription: "Sign in or create your Beaumont account.",
    panelHeading: "Your home, returned to quiet perfection.",
    quoteCreatedTitle: "Quote created",
    quoteCreatedBody:
      "Create an account to save it and track Beaumont’s response.",
    headingSignup: "Create your account",
    headingSignin: "Welcome back",
    subSignup: "Save estimates and manage your exterior care.",
    subSignin: "Sign in to manage quotes, visits, payments, and points.",
    tabSignin: "Sign in",
    tabSignup: "Create account",
    tabMagic: "Magic link",
    fieldFullName: "Full name",
    fieldEmail: "Email",
    fieldPassword: "Password",
    fieldReferral: "Referral code (optional)",
    referralPlaceholder: "Enter a friend's code",
    or: "or",
    continueGoogle: "Continue with Google",
    submitSignin: "Sign in",
    submitSignup: "Create account",
    submitMagic: "Send magic link",
    disabledHeading: "Connect Supabase locally",
    disabledBodyA:
      "This build cannot see a Supabase URL or public client key. Add them to",
    disabledBodyB: "and restart the site to enable real accounts.",
    disabledCta: "Continue to quote request",
    errSupabase:
      "Supabase is not available in this local build. Add the public URL and client key, then restart the site.",
    errCredentials: "Enter both your email and password.",
    errFullName: "Enter your full name.",
    errEmail: "Enter your email address.",
    errPassword: "Use a password with at least 8 characters.",
    errDuplicate:
      "An account already exists for this email. Try signing in instead.",
    successSignup:
      "Your account was created. Check your email to confirm it, then return here to sign in.",
    successReferralSaved: "Your referral code has been saved.",
    successMagic: "Magic link sent. Check your inbox to continue.",
    errDisabledConfig: "Supabase is not configured in this local build.",
    errAuthExpired:
      "That sign-in link could not be completed. It may have expired.",
    errOauth: "Google sign-in could not be completed.",
    errMissingCode: "The sign-in link is missing its authorization code.",
  },

  quotePage: {
    metaTitle: "Free estimate",
    metaDescription:
      "Build your Beaumont exterior-care request in about two minutes. A specialist reviews every detail and replies with a clear written quote, usually within 24 hours.",
  },

  quote: {
    steps: {
      property: { label: "Property", short: "Home" },
      services: { label: "Services", short: "Care" },
      details: { label: "Details", short: "" },
      contact: { label: "Contact", short: "You" },
    },
    scenes: {
      property: {
        eyebrow: "First, the address",
        title: "Let's start at your front door.",
        copy: "The address is all we need — it tells us the surfaces, the access, and the right questions to ask.",
      },
      services: {
        eyebrow: "Your visit",
        title: "What needs washing?",
        copy: "Pick one service or several — this is a wish list, not a booking.",
      },
      details: {
        eyebrow: "Three quick answers",
        title: "Tell us what you're seeing.",
        copy: "Rough answers are all we need. We confirm every detail before your quote.",
      },
      contact: {
        eyebrow: "Your request is ready",
        title: "Where do we send the quote?",
        copy: "Written, itemized, and priced before we start — reviewed by a real person, usually within 24 hour",
      },
    },
    propertySizes: {
      small: { label: "A small area", note: "Entry, steps, or front walk" },
      single: {
        label: "One main surface",
        note: "Driveway, deck, patio, or facade",
      },
      multi: { label: "A few areas", note: "Two or more exterior surfaces" },
      full: { label: "The full exterior", note: "A whole-property refresh" },
    },
    conditions: {
      light: { label: "A seasonal refresh", note: "Light, everyday buildup" },
      algae: { label: "Algae or grime", note: "Green, black, or slippery areas" },
      stains: { label: "Stubborn stains", note: "Oil, rust, or marked spots" },
      delicate: {
        label: "A delicate surface",
        note: "Older, painted, wood, or soft-wash only",
      },
    },
    serviceDescriptions: {
      driveway: "Concrete, interlock, asphalt, steps, and walkways.",
      deck: "Wood, composite, concrete, and outdoor living areas.",
      "house-wash": "Siding, brick, stucco, and delicate exterior finishes.",
      "windows-atlantic": "Exterior glass, frames, and sills, left streak-free.",
    },
    header: {
      eyebrow: "Personal estimate",
      sub: "About 2 minutes · no payment",
      progressAria: "Estimate progress",
    },
    audio: {
      label: "Audio guide",
      description: "A quiet cue for each step",
      replayTitle: "Replay this step",
      mute: "Mute",
      unmute: "Unmute",
    },
    step0: {
      overline: "First, the property",
      title: "Where are we caring for?",
      copy: "Start with an address. That's all we need to understand the home and prepare the right next questions.",
      addressLabel: "Home address",
      addressPlaceholder: "Street address or postal code",
      find: "Find",
      findAddress: "Find address",
      searching: "Searching…",
      useLocation: "Use my current location",
      locating: "Finding your area…",
      propertyFound: "Property found",
      trustPrivate: "Kept private",
      trustNoMeasure: "No exact measurements",
      trustReply: "Reply within 24h",
      submit: "This is the place",
    },
    addressSearch: {
      noMatch: "No matching address found. Try adding the city or postal code.",
      unavailable: "Address search is unavailable.",
      failed: "Address search failed. Please try again.",
      networkEstimating: "Using your network to estimate the nearest city…",
      networkUnavailable: "Network location unavailable",
      blocked:
        "Location is blocked in this browser. Allow location for this site, or enter a Canadian postal code above.",
      requesting: "Requesting location permission…",
      undetermined:
        "We could not determine your location. Enter a Canadian address or postal code instead.",
      approxArea: "Your approximate area",
      approxLocation: "Your approximate location",
    },
    step1: {
      overline: "Shape your visit",
      title: "What would you like to refresh?",
      copy: "Choose everything you're considering. You can select more than one, and nothing is booked today.",
      selectAtLeastOne: "Select at least one to continue",
      servicesSelectedOne: "{n} service selected",
      servicesSelectedMany: "{n} services selected",
      submit: "Continue",
    },
    step2: {
      overline: "The quick picture",
      title: "Help us see what you see.",
      copy: "No measuring and no technical language. Pick the answers that feel closest—we'll verify the rest.",
      q1: "How much of the property needs care?",
      q2: "What stands out right now?",
      selectAllApply: "Select all that apply",
      q3: "Is this a one-time visit or ongoing care?",
      addAnything: "Add anything else",
      notePlaceholder:
        "Access details, a particular surface, or anything else you'd like us to know…",
      noteLabel: "A note for the team",
      submit: "Looks good",
    },
    step3: {
      overlineReady: "Your request is ready",
      titleSave: "Your request is ready to save.",
      titleReceived: "Consider it received.",
      titleDefault: "Where should we send your quote?",
      titleSignedIn: "Confirm and send to your account.",
      copySave: "One quick step keeps your quote connected to you.",
      copyReceived: "We'll take it from here.",
      copyDefault:
        "Share the best way to reach you. These details are used only for this request.",
      copySignedIn:
        "Your details are filled in from your account. Review them and we'll add this quote to your dashboard.",
      fullName: "Full name",
      fullNamePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      phone: "Phone",
      phoneHint: "For quick scheduling questions",
      phonePlaceholder: "(514) 555-0123",
      carePlan: "Your care plan",
      summaryProperty: "Property",
      summaryCare: "Care",
      summaryPlan: "Plan",
      securityNote:
        "Your request is saved securely. If you're new to Beaumont, we'll help you create your client access before it's sent.",
      securityNoteSignedIn:
        "Your request is saved securely to your account the moment you send it.",
      createAccount: "Create account and save quote",
      alreadyHaveAccount: "Already have an account? Sign in",
      submit: "Send my request",
      sending: "Sending…",
      startAnother: "Start another request",
      tryAgain: "Try again",
    },
    results: {
      createdTitle: "Your quote request is created.",
      createdMessage:
        "Create your free account to save this request and receive Beaumont's written quote. Your name and email are already filled in.",
      goodHandsTitle: "Your request is in good hands.",
      savedToAccountTitle: "Quote added to your account.",
      savedToAccountMessage:
        "Taking you to your quotes…",
      deliveredMessage:
        "A Beaumont specialist will review everything and reply with your written quote, usually within 24 hours.",
      savedMessage:
        "Your request is safely saved. Beaumont can see every detail while the notification is retried.",
      errorTitle: "We couldn't send that just yet.",
      errorMessage: "Something went wrong. Please try again.",
      errorRetryMessage: "Your details are still here. Please try once more.",
      expiredTitle: "Your saved details have expired.",
      expiredMessage:
        "Please complete the request again—it only takes a moment.",
      restoreErrorTitle: "We couldn't restore your request.",
      restoreErrorMessage:
        "Please complete it again—your previous request was not sent.",
    },
    cancel: {
      confirm: "Are you sure you want to cancel and delete this quote request?",
      button: "Cancel Quote",
      canceling: "Canceling...",
    },
    capturedSoFar: "Captured so far",
  },

  dashboard: {
    nav: {
      overview: "Overview",
      quotes: "Quotes",
      payments: "Payments",
      contract: "Contract",
      rewards: "Rewards",
      referrals: "Referrals",
      gallery: "My Gallery",
      navAria: "Account navigation",
      signOut: "Sign out",
    },
    layout: {
      eyebrow: "Private client area",
      welcome: "Welcome back,",
      rewardBalance: "Reward balance",
      towardVisit: "toward your next visit",
      previewMode: "Preview mode.",
      previewBody:
        "Connect Supabase to enable live accounts, saved quotes, payments, rewards, and galleries.",
    },
    overview: {
      rewardPoints: "Reward points",
      value: "value",
      activeQuotes: "Active quotes",
      outstanding: "Outstanding",
      awaitingPayment: "Awaiting payment",
      allSettled: "All settled",
      recentQuotes: "Recent quotes",
      viewAll: "View all",
      noQuotesTitle: "No quotes yet",
      noQuotesBody:
        "Send the services you need reviewed and Beaumont will confirm a written quote.",
      requestQuote: "Request a quote",
      quoteFallback: "Quote",
      pendingReview: "Pending review",
      referEarn: "Refer & earn",
      referBody: "Share your code and you both earn",
      pointsOnFirstJob: "points on their first job.",
      getReferralLink: "Get your referral link",
      needVisit: "Need another visit?",
      needVisitBody:
        "Send a new scope for review and redeem points once a quote is confirmed.",
      newQuoteRequest: "New quote request",
    },
    contract: {
      noContractTitle: "No contract yet",
      noContractBody:
        "When you accept a quote, your service agreement will appear here to review and e-sign.",
      viewQuotes: "View quotes",
      agreementTitle: "Service agreement",
      termsFallback: "Your service agreement terms will appear here.",
      signedOn: "Signed on",
      thankYou: ". Thank you.",
      signedShort: "Signed",
      agreeLabel:
        "I have read and agree to the terms of this service agreement.",
      signing: "Signing…",
      eSign: "E-sign agreement",
      couldNotSign: "Could not sign.",
      errNotEnabled: "Not enabled.",
      errSignIn: "Please sign in.",
    },
    gallery: {
      noPhotosTitle: "No photos yet",
      noPhotosBody:
        "After your first clean, we'll post before & after photos of your home here.",
      bookFirst: "Book your first clean",
    },
    payments: {
      outstanding: "Outstanding",
      nothingTitle: "Nothing to pay",
      nothingBody:
        "When you accept a quote, you can settle it here by card, transfer, or cash.",
      viewQuotes: "View quotes",
      serviceFallback: "Service",
      history: "Payment history",
      noPayments: "No payments recorded yet.",
      errNotEnabled: "Payments are not enabled yet.",
      errSignIn: "Please sign in.",
      recordedTransfer:
        "Recorded. Use your quote number as the transfer reference, we'll confirm once funds arrive.",
      recordedCash:
        "Recorded. Pay your team at the appointment and we'll mark it complete.",
      errCard: "Could not start card payment.",
      settle: "Settle",
      byMethod: "by your preferred method:",
      payByCard: "Pay by card",
      cardComingSoon: "Card (coming soon)",
      bankTransfer: "Bank transfer",
      cashOnService: "Cash on service",
      cardNotEnabled:
        "Card payments aren't enabled yet, choose transfer or cash.",
      cardActivateNote:
        "Card payments activate once Stripe keys are added. Transfer and cash work today.",
      couldNotStart: "Could not start payment.",
    },
    quotes: {
      noQuotesTitle: "No quotes yet",
      noQuotesBody:
        "Your saved and requested quotes will appear here. Start by sending the services you need reviewed.",
      requestQuote: "Request a quote",
      quoteFallback: "Quote",
      total: "Total",
      status: "Status",
      pendingReview: "Pending review",
      errUnavailable: "Service unavailable.",
      errMustLogin: "You must be logged in to cancel a quote.",
      errNotFound:
        "Quote not found or you don't have permission to cancel it.",
      errCancelFailed: "Failed to cancel quote. Please try again.",
      newBack: "← Back to quotes",
      newEyebrow: "New request",
      newTitle: "Request your next visit.",
      newBody:
        "Choose the exterior services you need reviewed and send the request directly from your client portal.",
    },
    referrals: {
      yourLink: "Your referral link",
      shareBody: "Share Beaumont with friends. When they book their first clean, you both earn",
      points: "points.",
      friendsReferred: "Friends referred",
      rewardsEarned: "Rewards earned",
      completed: "completed",
      howItWorks: "How it works",
      step1: "Share your unique link or code with a friend.",
      step2: "They sign up and book their first Beaumont clean.",
      step3a: "Once their job is paid, you both receive",
      step3b: "points.",
      yourCode: "Your code",
      copy: "Copy",
      copied: "Copied!",
    },
    rewards: {
      pointsBalance: "Points balance",
      towardVisit: "toward your next visit",
      redemptionRate: "Redemption rate",
      pts: "100 pts",
      discount: "= $10 discount",
      howYouEarn: "How you earn",
      activity: "Activity",
      noActivityTitle: "No activity yet",
      noActivityBody:
        "Earn your first points by creating an account and booking a clean.",
      requestQuote: "Request a quote",
      createAccount: "Create an account",
      acceptQuote: "Accept a quote",
      completedJob: "Completed job",
      successfulReferral: "Successful referral",
    },
    rewardsShowcase: {
      eyebrow: "Beaumont Rewards",
      heading: "Every clean earns you more",
      bodyA:
        "Collect points on signup, completed jobs, and referrals. Every 100 points is worth $10 toward future visits. Refer a friend and you both earn",
      bodyB: "points.",
      createAccount: "Create your account",
      startQuote: "Start a quote",
      howYouEarn: "How you earn",
    },
  },

  admin: {
    nav: {
      inbox: "Inbox",
      clients: "Clients",
      jobs: "Jobs",
      payments: "Payments",
      settings: "Settings",
    },
    gate: {
      noBackend: "Connect Supabase to enable the staff admin panel (see README).",
      signedOut: "Please sign in with a staff account to access admin.",
      notStaff:
        "This area is for Beaumont staff. Your account doesn't have admin access.",
      staffOnly: "Staff only",
      home: "Home",
      signIn: "Sign in",
    },
    inbox: {
      title: "Inbox",
      description:
        "Work quote requests from first review to accepted job. Open a quote to edit price, reuse past pricing, add staff notes, and schedule.",
      findClient: "Find client",
      needsQuote: "Needs quote",
      sent: "Sent",
      accepted: "Accepted",
      scheduled: "Scheduled",
      awaitingPay: "Awaiting pay",
      noWorkTitle: "No active work",
      noWorkBody:
        "New customer quote requests and active jobs will appear here.",
      needsQuoteBody:
        "Set a final price or reuse a matching previous quote, then send it.",
      sentWaiting: "Sent, waiting for customer",
      sentWaitingBody:
        "Follow up, resend if needed, or mark accepted once the customer agrees.",
      acceptedNeedsScheduling: "Accepted, needs scheduling",
      acceptedBody: "Schedule the job from the quote detail page.",
      scheduledBody: "Complete the job when service is done.",
      quoteRequestFallback: "Quote request",
      addressUnavailable: "Address unavailable",
      serviceNotRecorded: "Service not recorded",
      needsPrice: "Needs price",
      email: "Email",
      phone: "Phone",
      requested: "Requested",
      previousMatch: "Previous match:",
      usePrevious: "Use previous quote",
      openQuote: "Open quote",
      viewClient: "View client",
      sendQuote: "Send quote",
      markAccepted: "Mark accepted",
      markCompleted: "Mark completed",
      completed: "Completed",
    },
    clients: {
      title: "Clients",
      description:
        "Search customer accounts, open support context, and confirm previous quote totals before replying.",
      openInbox: "Open inbox",
      searchPlaceholder:
        "Search name, email, phone, address, service, or status",
      search: "Search",
      clear: "Clear",
      clientsShown: "Clients shown",
      quotesShown: "Quotes shown",
      quotedValue: "Quoted value",
      noMatchTitle: "No matching clients",
      noMatchBody: "Try a different name, email, phone, address, or service.",
      noClientsTitle: "No clients yet",
      noClientsBody: "Customer accounts and quote requests will appear here.",
      viewAccount: "View account",
      noEmail: "No email on file",
      quotes: "Quotes",
      lastQuote: "Last quote",
      lastTotal: "Last total",
      reviewNeeded: "Review needed",
      paid: "Paid",
      points: "Points",
      none: "None",
      latestRequest: "Latest request:",
      at: "at ",
      quoteOnly: "Quote only",
      serviceFallback: "Service not recorded",
    },
    clientDetail: {
      backToClients: "Back to clients",
      openRequests: "Open requests",
      quotes: "Quotes",
      quotedValue: "Quoted value",
      paid: "Paid",
      points: "Points",
      quoteReference: "Quote reference",
      latestPriced: "Latest priced quote",
      referenceHint:
        "Use this as the support reference when the same client asks for the same address, service, and scope.",
      date: "Date",
      service: "Service",
      address: "Address",
      frequency: "Frequency",
      openReference: "Open reference quote",
      recentPriced: "Recent priced history",
      noPricedTitle: "No priced quote yet",
      noPricedBody:
        "Past requests exist, but none have a confirmed total. Review the scope before sending a price.",
      staffNotes: "Staff notes",
      staffNotesPlaceholder:
        "Staff-only notes about preferences, access, parking, special pricing, or support context.",
      saveClientNotes: "Save client notes",
      clientNotesFallback:
        "Client notes need a full account profile. Use quote notes for quote-only records.",
      accountDetails: "Account details",
      profileId: "Profile ID",
      quoteOnlyRecord: "Quote-only record",
      role: "Role",
      name: "Name",
      email: "Email",
      phone: "Phone",
      created: "Created",
      referralCode: "Referral code",
      supportContext: "Support context",
      lastRequest: "Last request",
      lastStatus: "Last status",
      noRequests: "No requests",
      lastService: "Last service",
      lastAddress: "Last address",
      payments: "Payments",
      contracts: "Contracts",
      pastQuotes: "Past quotes",
      noHistoryTitle: "No quote history",
      noHistoryBody: "This account does not have any quote requests yet.",
      reviewItems: "Review items: ",
      scopeDetails: "Scope details",
      requester: "Requester",
      contactEmail: "Contact email",
      accountEmail: "Account email",
      quoteId: "Quote ID",
      sourceZone: "Source zone",
      notification: "Notification",
      noPayments: "No payments recorded.",
      rewards: "Rewards",
      noRewards: "No rewards ledger entries.",
      referrals: "Referrals",
      noReferrals: "No referrals recorded.",
      noContracts: "No contracts recorded.",
      created2: "Created ",
      signed: "Signed ",
      rewardGranted: "Reward granted",
      pendingReward: "Pending reward",
    },
    doorTags: {
      title: "Door-tag program",
      description:
        "Generate premium QR door hangers per neighbourhood. Each tag deep-links into the quote request tool pre-tuned for that zone and is tracked, so you can follow the scan to booking funnel. Generate, then print on heavyweight stock and die-cut the top notch.",
      generateHeading: "Generate door tags",
      generateDescription:
        "One zone per line. Each tag gets a unique QR that pre-seeds the quote tool with its zone and tracks scans → quotes → bookings.",
      zonesLabel: "Zones / neighbourhoods",
      perZone: "Per zone",
      generate: "Generate",
      generating: "Generating…",
      printTags: "Print",
      tags: "tags",
      scanFree: "Scan for a free estimate on",
      thisHome: "this",
      home: "home",
    },
    gallery: {
      existingItems: "Existing items",
      noItems: "No gallery items yet.",
      before: "Before",
      after: "After",
      dragToCompare: "Drag to compare before and after",
      untitled: "Untitled",
      featured: "Featured",
      addHeading: "Add before / after",
      addDescription:
        "Paste image URLs (from Supabase Storage gallery bucket or elsewhere). Featured items show on the public site.",
      beforeUrl: "Before URL",
      afterUrl: "After URL",
      caption: "Caption",
      urlPlaceholder: "https://…",
      featureOnSite: "Feature on public site",
      addItem: "Add item",
      adding: "Adding…",
      added: "Added ✓",
    },
    jobs: {
      title: "Jobs",
      description:
        "Accepted quotes become jobs. Schedule them from the quote page and mark them complete when service is finished.",
      inbox: "Inbox",
      noJobsTitle: "No jobs yet",
      noJobsBody: "Accepted and scheduled quotes will appear here.",
      needsScheduling: "Needs scheduling",
      scheduled: "Scheduled",
      completed: "Completed",
      jobFallback: "Job",
      addressNotRecorded: "Address not recorded",
      serviceNotRecorded: "Service not recorded",
      noPrice: "No price",
      openJob: "Open job",
      markCompleted: "Mark completed",
      scheduledPrefix: "Scheduled: ",
    },
    payments: {
      title: "Payments",
      description:
        "Confirm cash and e-transfer payments, then keep quote/job records in sync.",
      jobs: "Jobs",
      awaiting: "Awaiting",
      paid: "Paid",
      paidTotal: "Paid total",
      noPaymentsTitle: "No payments yet",
      noPaymentsBody: "Customer payments will appear here once created.",
      createdPrefix: "Created ",
      paidPrefix: "Paid ",
      markPaid: "Mark paid",
      openQuote: "Open quote",
    },
    pricing: {
      title: "Pricing",
      description:
        "Edit internal pricing fields for each service. Customer requests stay review-based until a final quote is confirmed.",
      noServicesTitle: "No services",
      noServicesBody: "Run the database migration to seed the service catalogue.",
      basePrice: "Base price ($)",
      legacyArea: "Legacy area field ($)",
      multiplier: "Multiplier",
    },
    quoteDetail: {
      backToInbox: "Back to inbox",
      viewClient: "View client",
      finalQuote: "Final quote",
      status: "Status",
      requested: "Requested",
      scheduled: "Scheduled",
      reviewAndSend: "Review and send",
      reviewDescription:
        "Set the final quote, keep staff-only context, and move the request through the real workflow.",
      customer: "Customer",
      name: "Name",
      email: "Email",
      phone: "Phone",
      accountEmail: "Account email",
      markAccepted: "Mark accepted",
      markScheduled: "Mark scheduled",
      markCompleted: "Mark completed",
      previousMatch: "Previous quote match",
      keepConsistent: "Use this to keep pricing consistent",
      usePrevious: "Use previous quote",
      noMatch:
        "No matching priced quote found for the same client, address, and service.",
      requestScope: "Request scope",
      service: "Service",
      visitRhythm: "Visit rhythm",
      sourceZone: "Source zone",
      notification: "Notification",
      reviewItems: "Review items: ",
      customerScope: "Customer scope",
      pricedHistory: "Priced history",
      noPricedTitle: "No previous priced quotes",
      noPricedBody:
        "Once this customer has a confirmed quote, it will appear here for future consistency.",
      useThisPrice: "Use this price",
      paymentsOnQuote: "Payments on this quote",
      noPaymentsLinked: "No payments linked yet.",
    },
    settings: {
      title: "Settings",
      description:
        "Less-used admin tools live here. Daily support work should happen in Inbox, Clients, Jobs, and Payments.",
      galleryTitle: "Marketing gallery",
      galleryDescription:
        "Manage before-and-after images shown on the public site.",
      doorTagTitle: "Door tag QR codes",
      doorTagDescription:
        "Generate outreach QR codes and landing links for field marketing.",
      pricingTitle: "Pricing config",
      pricingDescription:
        "Legacy pricing knobs. Use this only if you intentionally bring formula pricing back.",
      open: "Open",
      staffAccess: "Staff access",
      staffAccessBody:
        "New signups are customers by default. Grant staff access manually in Supabase by setting public.profiles.role to staff for a verified account.",
    },
    quoteReviewForm: {
      needsQuote: "Needs quote",
      sentToCustomer: "Sent to customer",
      accepted: "Accepted",
      scheduled: "Scheduled",
      completed: "Completed",
      finalAmount: "Final quote amount",
      status: "Status",
      scheduledDate: "Scheduled date",
      internalNotes: "Internal staff notes",
      notesPlaceholder:
        "What should staff know before quoting, scheduling, or replying?",
      save: "Save",
      saving: "Saving...",
      saveAndSend: "Save and send quote",
      working: "Working...",
      savedAndSent: "Quote saved and sent.",
      savedOnly: "Quote saved.",
      actionFailed: "Action failed.",
    },
    actionButton: {
      done: "Done",
    },
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  statuses: {
    draft: "Brouillon",
    requested: "Demandée",
    sent: "Envoyée",
    accepted: "Acceptée",
    scheduled: "Planifiée",
    completed: "Complété",
    awaiting: "En attente",
    paid: "Payé",
    refunded: "Remboursé",
    signed: "Signé",
  },

  common: {
    montreal: "Grand Montréal",
    brandSuffix: "· Admin",
    notProvided: "Non fourni",
    notRecorded: "Non consigné",
    notSelected: "Non sélectionné",
    notSet: "Non défini",
    notAvailable: "Non disponible",
    none: "Aucun",
    optional: "Facultatif",
    edit: "Modifier",
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Enregistré ✓",
    open: "Ouvrir",
    back: "Retour",
    home: "Accueil",
    language: "Langue",
    signIn: "Se connecter",
    oneMoment: "Un instant…",
  },

  nav: {
    services: "Services",
    about: "Qui nous sommes",
    quote: "Soumission gratuite",
    terms: "Conditions",
    partners: "Partenaires",
    hiring: "Emplois",
  },

  site: {
    tagline: "Entretien résidentiel de conciergerie, discrètement livré.",
    description:
      "Beaumont offre un nettoyage extérieur professionnel : lavage à pression, lavage en douceur et entretien des fenêtres dans le Grand Montréal.",
    promise: "Une arrivée plus lumineuse, discrètement livrée.",
  },

  services: {
    driveway: {
      name: "Lavage d’entrées et de surfaces dures",
      description:
        "Entrées, allées, patios et marches — huile, mousse et sel accumulé tout l’hiver, éliminés uniformément, d’un bord à l’autre.",
    },
    deck: {
      name: "Lavage de terrasses et de clôtures",
      description:
        "Bois et composite, lavés assez délicatement pour protéger le grain et la teinture — prêts pour la saison ou pour une nouvelle finition.",
    },
    "house-wash": {
      name: "Lavage en douceur de la maison et du revêtement",
      description:
        "Vinyle, brique et stuc nettoyés à basse pression avec la bonne solution — algues et saleté éliminées, sans endommager la surface.",
    },
    "windows-atlantic": {
      name: "Entretien des fenêtres",
      description:
        "Nettoyage intérieur et extérieur des fenêtres par nos partenaires spécialistes — réservé lors de la même visite, selon les mêmes standards.",
    },
  },

  frequencies: {
    one_time: { label: "Ponctuel", note: "Une seule visite" },
    monthly: { label: "Saisonnier", note: "Un rafraîchissement saisonnier planifié" },
    biweekly: { label: "Deux fois l’an", note: "Printemps et automne, le plus populaire" },
    weekly: { label: "Annuel", note: "Une restauration annuelle" },
  },

  addOns: {
    gutters: "Nettoyage des gouttières",
    "stain-review": "Examen des taches d’huile, de rouille ou d’algues",
  },

  hero: {
    eyebrowA: "Entretien résidentiel de conciergerie",
    eyebrowB: "En toute discrétion",
    titleA: "Lavage a Pression, Lavage en Douceur",
    titleB: "et Entretien des Fenêtres pour les maisons du Grand Montréal.",
    body: "Voyez votre maison comme elle devrait être.",
    ctaPrimary: "Obtenez votre soumission gratuite",
    ctaSecondary: "Notre approche",
    scrollNote: "Une approche réfléchie de l’entretien extérieur",
    imageAlt:
      "Maison montréalaise en pierre pâle avec une entrée en pavé uni restaurée",
  },

  principles: {
    sectionLabel: "Principes de service Beaumont",
    a: {
      title: "Adapté au matériau",
      copy: "Une méthode choisie pour chaque surface.",
    },
    b: {
      title: "Géré discrètement",
      copy: "Vous saurez quand nous arrivons. Vous n’aurez rien à faire pendant notre présence.",
    },
    c: {
      title: "Simple à organiser",
      copy: "Demandez le bon entretien extérieur à un seul endroit.",
    },
  },

  servicesSection: {
    eyebrow: "Services",
    intro:
      "Lavage à pression, lavage en douceur et entretien spécialisé des fenêtres : la bonne méthode pour chaque surface de votre maison.",
    titleA: "Chaque surface extérieure.",
    titleB: "Un même standard d’entretien.",
    service: "Service",
    details: {
      driveways: "Entrées et pierre",
      decks: "Terrasses et patios",
      houses: "Extérieurs de maison",
      windows: "Entretien spécialisé des fenêtres",
    },
    types: {
      pressure: "Lavage à pression",
      soft: "Lavage en douceur",
      windows: "Lavage de fenêtres extérieures",
    },
  },

  approach: {
    eyebrow: "Qui nous sommes",
    titleA: "Un service discret.",
    titleB: "Un soin rigoureux.",
    intro:
      "Beaumont, c’est l’entretien extérieur sans le bruit — sans devinettes, sans vente insistante à la porte, sans dégâts laissés derrière. Chaque visite se déroule de la même façon : confirmée à l’avance, réalisée avec soin et passée en revue avec vous à la fin.",
    imageCaption: "Entretien extérieur adapté au matériau",
    imageAlt:
      "Un technicien Beaumont nettoyant une terrasse extérieure près d’une maison montréalaise",
    chapters: {
      arrival: {
        eyebrow: "L’arrivée",
        title: "Prêts avant de commencer.",
        copy: "Nous confirmons ce qui sera nettoyé, prétraitons et protégeons vos plantes et vos installations, puis choisissons le traitement approprié — avant que l’eau ne touche la pierre.",
      },
      work: {
        eyebrow: "Le travail",
        title: "La pression, appliquée avec précision.",
        copy: "Béton, pavés, pierre naturelle et revêtement reçoivent chacun la méthode adaptée au matériau — haute pression là où elle convient, lavage en douceur là où elle ne convient pas. Jamais un seul réglage pour tout.",
      },
      return: {
        eyebrow: "03 — L’INSPECTION",
        title: "Terminons ensemble.",
        copy: "Nous faisons le tour de la propriété avec vous avant de partir — chaque surface vérifiée, chaque recoin rincé, rien ne vous est laissé à inspecter seul.",
      },
    },
  },

  testimonialSection: {
    sectionLabel: "Témoignage de client",
    clientNote: "Mot d’un client",
    quote:
      "Ça a rajeuni toute la maison. La propriété semblait simplement bien entretenue à nouveau.",
    attribution: "Eleanor V. · cliente de Beaumont",
  },

  quoteCta: {
    eyebrow: "Soumission gratuite",
    titleA: "Votre propriété. Votre entretien.",
    titleB: "Une soumission révisée.",
    body: "Indiquez votre adresse, choisissez les services extérieurs dont vous avez besoin et envoyez la portée pour révision — en quelques étapes tranquilles.",
    featureNoPayment: "Aucun paiement pour faire la demande",
    featureWritten: "Une soumission écrite en moins de 24 heures",
    button: "Obtenez votre soumission gratuite",
    sub: "Environ 2 minutes · aucun paiement requis",
  },

  cta: {
    band: {
      eyebrow: "Quand vous voulez",
      title: "Voyez ce que Beaumont ferait pour votre maison.",
      button: "Obtenez votre soumission gratuite",
    },
    process: {
      text: "Ça vous parle? Commencez par votre adresse.",
      button: "Demander votre soumission",
    },
    sticky: {
      label: "Soumission gratuite · réponse en 24 h",
      button: "Obtenir une soumission",
    },
  },

  contact: {
    eyebrow: "Contact",
    titleA: "Vous préférez en parler?",
    titleB: "Nous sommes là.",
    body: "Pour des questions, des détails sur la propriété ou une portée plus personnalisée, joignez-nous directement. Nous répondons avec clarté et sans pression.",
    emailLabel: "Écrire à Beaumont",
    followLabel: "Suivez notre travail",
    hours: "Lundi au samedi · Soumissions en ligne en tout temps",
  },

  partners: {
    title: "Nos partenaires",
    intro:
      "Nous travaillons avec des partenaires spécialisés afin d’offrir un entretien extérieur complet pour votre maison.",
    quickCleanDescription:
      "Spécialistes du lavage de fenêtres, des traitements contre les araignées et du lavage de fenêtres de condos. QuickClean veille à ce que les surfaces délicates de votre propriété soient traitées avec le plus grand soin et professionnalisme.",
    atlanticDescription:
      "Spécialistes du nettoyage de fenêtres et de gouttières, ainsi que des soffites et des portes de garage. Atlantic apporte des années d'expérience pour redonner aux maisons leur meilleur aspect.",
  },

  hiring: {
    homeEyebrow: "Bâtissez avec Beaumont",
    homeTitleA: "Du bon travail.",
    homeTitleB: "Un véritable élan.",
    homeBody:
      "Joignez-vous à une équipe qui valorise la discipline, une communication claire et un travail dont vous pouvez être fier.",
    techniciansLabel: "Pour les techniciens",
    techniciansTitle: "Maîtrisez un métier sur le terrain.",
    techniciansBody:
      "Apprenez l’entretien extérieur adapté aux matériaux, livrez un travail rigoureux et évoluez avec une équipe attentive aux détails.",
    repsLabel: "Pour les représentants",
    repsTitle: "Transformez vos aptitudes relationnelles en atout professionnel.",
    repsBody:
      "Développez votre confiance, votre communication et une méthode de vente durable avec le soutien d’une équipe qui veut votre réussite.",
    exploreRole: "Découvrir ce rôle",
    page: {
      metaTitle: "Emplois",
      metaDescription:
        "Découvrez les possibilités de technicien et de représentant chez Beaumont dans le Grand Montréal.",
      eyebrow: "Carrières chez Beaumont",
      titleA: "Un travail qui bâtit",
      titleB: "plus qu’un CV.",
      intro:
        "Nous bâtissons une équipe engagée dans le Grand Montréal—des personnes qui se soucient de la qualité de leur travail, de leur communication et des compétences qu’elles développent.",
      principlesLabel: "Ce que vous pouvez attendre",
      principleOneTitle: "Des standards visibles",
      principleOneBody:
        "Des attentes claires, une formation réfléchie et un travail soigné de l’arrivée jusqu’à l’inspection finale.",
      principleTwoTitle: "Des compétences qui grandissent",
      principleTwoBody:
        "Un accompagnement pratique en service, communication, responsabilité et résolution de problèmes—utile ici comme ailleurs.",
      principleThreeTitle: "La possibilité de gagner et d’évoluer",
      principleThreeBody:
        "Le rendement est reconnu. L’initiative, la constance et le leadership ouvrent la voie à davantage de responsabilités.",
      techniciansEyebrow: "Équipe terrain",
      techniciansTitle: "Techniciens en entretien extérieur",
      techniciansIntro:
        "Pour ceux qui aiment les résultats concrets, les journées actives et l’apprentissage d’un métier pratique.",
      techniciansPointOne: "Apprendre des méthodes sécuritaires de lavage à pression et en douceur",
      techniciansPointTwo: "Travailler avec une équipe minutieuse partout dans le Grand Montréal",
      techniciansPointThree: "Développer ses compétences en service, planification et leadership terrain",
      techniciansFitTitle: "Ce rôle pourrait vous convenir si",
      techniciansFitBody:
        "Vous êtes fiable, à l’aise de travailler dehors, attentif aux détails et prêt à apprendre un processus rigoureux. L’expérience est un atout, mais le caractère et la constance comptent avant tout.",
      techniciansCta: "Postuler comme technicien",
      repsEyebrow: "Équipe croissance",
      repsTitle: "Représentants des ventes",
      repsIntro:
        "Pour les communicateurs ambitieux—notamment les athlètes—qui recherchent un potentiel de revenu flexible et une compétence utile à vie.",
      partnershipLabel: "Parcours pour athlètes",
      partnershipTitle: "En partenariat avec PROTOTYPE SPORTS GROUP",
      partnershipBody:
        "Grâce à notre partenariat avec PROTOTYPE SPORTS GROUP, nous embauchons des athlètes et les aidons à financer leur carrière tout en développant des compétences durables en communication, relations, discipline et vente. Ils pourront utiliser ces compétences pendant leur parcours sportif et pour le reste de leur vie.",
      repsPointOne: "Apprendre une méthode de vente claire, éthique et reproductible",
      repsPointTwo: "Développer sa confiance dans la prospection et les vraies conversations",
      repsPointThree: "Créer un revenu flexible tout en bâtissant des compétences de carrière",
      repsCta: "Postuler comme représentant",
      emailNote: "Parlez-nous un peu de vous et de ce qui vous attire dans ce rôle.",
    },
  },

  quoteThankYou: {
    metaTitle: "Merci",
    metaDescription: "Votre demande de soumission Beaumont a été reçue.",
    eyebrow: "Demande reçue",
    titleA: "Merci.",
    titleB: "Votre maison est entre bonnes mains.",
    body:
      "Votre demande a bien été transmise à Beaumont. Un spécialiste examinera la propriété, les services et les détails fournis avant de préparer votre soumission écrite.",
    nextLabel: "La suite",
    stepOneTitle: "Nous examinons la demande",
    stepOneBody: "Une personne vérifie les services, les surfaces, l’accès et les notes fournis.",
    stepTwoTitle: "Nous préparons votre soumission",
    stepTwoBody: "Vous recevez une tarification écrite et claire, habituellement en moins de 24 heures.",
    stepThreeTitle: "Vous décidez",
    stepThreeBody: "Aucun paiement maintenant et aucune pression pour aller de l’avant.",
    notificationSent: "Une confirmation a également été envoyée à votre adresse courriel.",
    notificationSaved: "Votre demande est enregistrée. Notre équipe communiquera directement avec vous.",
    viewQuotes: "Voir mes soumissions",
    returnHome: "Retour à l’accueil",
    support: "Vous souhaitez ajouter un détail? Écrivez à notre équipe de conciergerie.",
  },

  terms: {
    title: "Conditions",
    body: "Les soumissions sont confirmées après que Beaumont a examiné les services choisis, l’accès, la météo et l’état des surfaces. Aucun paiement n’est exigé pour demander une soumission.",
    pageTitle: "Conditions générales",
    intro:
      "Des attentes claires, une préparation soignée et aucuns frais cachés. Voici comment nous travaillons.",
    estimatesTitle: "Estimations et soumissions",
    estimatesBodyA:
      "Les estimations sont confirmées après que Beaumont a examiné les services choisis, l’accès, la météo et l’état des surfaces. Le prix affiché est le prix payé.",
    estimatesBodyB:
      "Aucun paiement n’est exigé lors d’une demande d’estimation. Nous fournissons une tarification claire et détaillée avant le début des travaux afin d’assurer une transparence complète.",
    executionTitle: "Exécution du service",
    executionBodyA:
      "Chaque visite se déroule de la même façon : confirmée à l’avance, réalisée avec soin et passée en revue avec vous à la fin.",
    executionBodyB:
      "Nous utilisons des techniques spécialisées, notamment le lavage en douceur pour les surfaces délicates comme le vinyle et le stuc, et le lavage à haute pression pour le béton et les entrées.",
    cancellationsTitle: "Annulations",
    cancellationsBody:
      "Nous comprenons que les plans peuvent changer. Si vous devez reporter ou annuler votre rendez-vous, nous vous demandons simplement de nous prévenir au moins 48 heures à l’avance.",
  },

  header: {
    homeAria: "accueil",
    primaryNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    account: "Compte",
    signIn: "Se connecter",
    freeEstimate: "Soumission gratuite",
    toggleMenu: "Ouvrir le menu",
    quote: "Soumission",
  },

  footer: {
    beginEstimate: "Commencer votre soumission",
    explore: "Explorer",
    contact: "Contact",
    clientSignIn: "Connexion client",
    termsLink: "Conditions générales",
  },

  auth: {
    metaTitle: "Connexion",
    metaDescription: "Connectez-vous ou créez votre compte Beaumont.",
    panelHeading: "Votre maison, rendue à une tranquille perfection.",
    quoteCreatedTitle: "Soumission créée",
    quoteCreatedBody:
      "Créez un compte pour l’enregistrer et suivre la réponse de Beaumont.",
    headingSignup: "Créez votre compte",
    headingSignin: "Bon retour",
    subSignup: "Enregistrez vos soumissions et gérez votre entretien extérieur.",
    subSignin:
      "Connectez-vous pour gérer vos soumissions, visites, paiements et points.",
    tabSignin: "Se connecter",
    tabSignup: "Créer un compte",
    tabMagic: "Lien magique",
    fieldFullName: "Nom complet",
    fieldEmail: "Courriel",
    fieldPassword: "Mot de passe",
    fieldReferral: "Code de parrainage (facultatif)",
    referralPlaceholder: "Entrez le code d’un ami",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    submitSignin: "Se connecter",
    submitSignup: "Créer un compte",
    submitMagic: "Envoyer le lien magique",
    disabledHeading: "Connectez Supabase en local",
    disabledBodyA:
      "Cette version ne voit aucune URL Supabase ni clé client publique. Ajoutez-les à",
    disabledBodyB: "et redémarrez le site pour activer les vrais comptes.",
    disabledCta: "Continuer vers la demande de soumission",
    errSupabase:
      "Supabase n’est pas disponible dans cette version locale. Ajoutez l’URL publique et la clé client, puis redémarrez le site.",
    errCredentials: "Entrez à la fois votre courriel et votre mot de passe.",
    errFullName: "Entrez votre nom complet.",
    errEmail: "Entrez votre adresse courriel.",
    errPassword: "Utilisez un mot de passe d’au moins 8 caractères.",
    errDuplicate:
      "Un compte existe déjà pour ce courriel. Essayez plutôt de vous connecter.",
    successSignup:
      "Votre compte a été créé. Vérifiez votre courriel pour le confirmer, puis revenez ici pour vous connecter.",
    successReferralSaved: "Votre code de parrainage a été enregistré.",
    successMagic:
      "Lien magique envoyé. Vérifiez votre boîte de réception pour continuer.",
    errDisabledConfig:
      "Supabase n’est pas configuré dans cette version locale.",
    errAuthExpired:
      "Ce lien de connexion n’a pas pu être complété. Il est peut-être expiré.",
    errOauth: "La connexion Google n’a pas pu être complétée.",
    errMissingCode: "Le lien de connexion n’a pas son code d’autorisation.",
  },

  quotePage: {
    metaTitle: "Soumission gratuite",
    metaDescription:
      "Préparez votre demande d’entretien extérieur Beaumont en environ deux minutes. Un spécialiste examine chaque détail et répond avec une soumission écrite claire, habituellement en moins de 24 heures.",
  },

  quote: {
    steps: {
      property: { label: "Propriété", short: "Maison" },
      services: { label: "Services", short: "Soin" },
      details: { label: "Détails", short: "" },
      contact: { label: "Contact", short: "Vous" },
    },
    scenes: {
      property: {
        eyebrow: "Un début tout simple",
        title: "Votre adresse en dit plus long qu’une mesure ne le pourrait.",
        copy: "Elle permet à notre équipe d’examiner la propriété, l’accès et le trajet avant de préparer quoi que ce soit.",
      },
      services: {
        eyebrow: "Conçu autour de votre maison",
        title: "Choisissez ce que vous remarquez. On relie les points.",
        copy: "Sélectionnez un seul service ou créez un rafraîchissement extérieur complet. Rien n’est réservé aujourd’hui.",
      },
      details: {
        eyebrow: "Aucun ruban à mesurer requis",
        title: "Une impression rapide suffit amplement.",
        copy: "Vos meilleures approximations sont les bienvenues. Un spécialiste Beaumont vérifie chaque détail avant de soumissionner.",
      },
      contact: {
        eyebrow: "La touche humaine",
        title: "Une vraie personne examine chaque demande.",
        copy: "Vous recevrez une soumission écrite claire — habituellement en moins de 24 heures, sans paiement ni pression.",
      },
    },
    propertySizes: {
      small: { label: "Une petite surface", note: "Entrée, marches ou allée avant" },
      single: {
        label: "Une surface principale",
        note: "Entrée, terrasse, patio ou façade",
      },
      multi: { label: "Quelques surfaces", note: "Deux surfaces extérieures ou plus" },
      full: { label: "Tout l’extérieur", note: "Un rafraîchissement complet de la propriété" },
    },
    conditions: {
      light: { label: "Un rafraîchissement saisonnier", note: "Accumulation légère et quotidienne" },
      algae: { label: "Algues ou crasse", note: "Zones vertes, noires ou glissantes" },
      stains: { label: "Taches tenaces", note: "Huile, rouille ou taches marquées" },
      delicate: {
        label: "Une surface délicate",
        note: "Plus ancienne, peinte, en bois ou lavage en douceur seulement",
      },
    },
    serviceDescriptions: {
      driveway: "Béton, pavé uni, asphalte, marches et allées.",
      deck: "Bois, composite, béton et espaces de vie extérieurs.",
      "house-wash": "Revêtement, brique, stuc et finis extérieurs délicats.",
      "windows-atlantic": "Vitres, cadres et rebords extérieurs, sans traces.",
    },
    header: {
      eyebrow: "Soumission personnalisée",
      sub: "Environ 2 minutes · aucun paiement",
      progressAria: "Progression de la soumission",
    },
    audio: {
      label: "Guide audio",
      description: "Un repère discret pour chaque étape",
      replayTitle: "Réécouter cette étape",
      mute: "Couper le son",
      unmute: "Activer le son",
    },
    step0: {
      overline: "D’abord, la propriété",
      title: "Où prenons-nous soin?",
      copy: "Commencez par une adresse. C’est tout ce qu’il nous faut pour comprendre la maison et préparer les bonnes questions suivantes.",
      addressLabel: "Adresse du domicile",
      addressPlaceholder: "Adresse municipale ou code postal",
      find: "Chercher",
      findAddress: "Chercher l’adresse",
      searching: "Recherche…",
      useLocation: "Utiliser ma position actuelle",
      locating: "Repérage de votre secteur…",
      propertyFound: "Propriété trouvée",
      trustPrivate: "Gardée privée",
      trustNoMeasure: "Aucune mesure exacte",
      trustReply: "Réponse en 24 h",
      submit: "C’est ici",
    },
    addressSearch: {
      noMatch:
        "Aucune adresse correspondante. Essayez d’ajouter la ville ou le code postal.",
      unavailable: "La recherche d’adresse est indisponible.",
      failed: "La recherche d’adresse a échoué. Veuillez réessayer.",
      networkEstimating:
        "Utilisation de votre réseau pour estimer la ville la plus proche…",
      networkUnavailable: "Position réseau indisponible",
      blocked:
        "La localisation est bloquée dans ce navigateur. Autorisez la localisation pour ce site, ou entrez un code postal canadien ci-dessus.",
      requesting: "Demande d’autorisation de localisation…",
      undetermined:
        "Nous n’avons pas pu déterminer votre position. Entrez plutôt une adresse ou un code postal canadien.",
      approxArea: "Votre secteur approximatif",
      approxLocation: "Votre position approximative",
    },
    step1: {
      overline: "Façonnez votre visite",
      title: "Que souhaitez-vous rafraîchir?",
      copy: "Choisissez tout ce que vous envisagez. Vous pouvez en sélectionner plusieurs, et rien n’est réservé aujourd’hui.",
      selectAtLeastOne: "Sélectionnez-en au moins un pour continuer",
      servicesSelectedOne: "{n} service sélectionné",
      servicesSelectedMany: "{n} services sélectionnés",
      submit: "Continuer",
    },
    step2: {
      overline: "Le portrait rapide",
      title: "Aidez-nous à voir ce que vous voyez.",
      copy: "Aucune mesure et aucun jargon technique. Choisissez les réponses qui se rapprochent le plus — nous vérifions le reste.",
      q1: "Quelle part de la propriété nécessite un entretien?",
      q2: "Qu’est-ce qui ressort en ce moment?",
      selectAllApply: "Sélectionnez tout ce qui s’applique",
      q3: "S’agit-il d’une visite ponctuelle ou d’un entretien continu?",
      addAnything: "Ajouter autre chose",
      notePlaceholder:
        "Détails d’accès, une surface particulière, ou tout autre chose à nous signaler…",
      noteLabel: "Une note pour l’équipe",
      submit: "Ça me va",
    },
    step3: {
      overlineReady: "Votre demande est prête",
      titleSave: "Votre demande est prête à être enregistrée.",
      titleReceived: "Considérez-la reçue.",
      titleDefault: "Où devons-nous envoyer votre soumission?",
      titleSignedIn: "Confirmez et envoyez à votre compte.",
      copySave: "Une étape rapide garde votre soumission liée à vous.",
      copyReceived: "On prend le relais.",
      copyDefault:
        "Indiquez la meilleure façon de vous joindre. Ces renseignements ne servent qu’à cette demande.",
      copySignedIn:
        "Vos renseignements proviennent de votre compte. Vérifiez-les et nous ajouterons cette soumission à votre tableau de bord.",
      fullName: "Nom complet",
      fullNamePlaceholder: "Votre nom",
      email: "Courriel",
      emailPlaceholder: "vous@exemple.com",
      phone: "Téléphone",
      phoneHint: "Pour les questions rapides de planification",
      phonePlaceholder: "(514) 555-0123",
      carePlan: "Votre plan d’entretien",
      summaryProperty: "Propriété",
      summaryCare: "Soin",
      summaryPlan: "Plan",
      securityNote:
        "Votre demande est enregistrée en toute sécurité. Si vous êtes nouveau chez Beaumont, nous vous aiderons à créer votre accès client avant l’envoi.",
      securityNoteSignedIn:
        "Votre demande est enregistrée en toute sécurité dans votre compte dès l’envoi.",
      createAccount: "Créer un compte et enregistrer la soumission",
      alreadyHaveAccount: "Vous avez déjà un compte? Connectez-vous",
      submit: "Envoyer ma demande",
      sending: "Envoi…",
      startAnother: "Commencer une autre demande",
      tryAgain: "Réessayer",
    },
    results: {
      createdTitle: "Votre demande de soumission est créée.",
      createdMessage:
        "Créez votre compte gratuit pour enregistrer cette demande et recevoir la soumission écrite de Beaumont. Votre nom et votre courriel sont déjà remplis.",
      goodHandsTitle: "Votre demande est entre bonnes mains.",
      savedToAccountTitle: "Soumission ajoutée à votre compte.",
      savedToAccountMessage: "Redirection vers vos soumissions…",
      deliveredMessage:
        "Un spécialiste Beaumont examinera le tout et répondra avec votre soumission écrite, habituellement en moins de 24 heures.",
      savedMessage:
        "Votre demande est bien enregistrée. Beaumont voit chaque détail pendant que la notification est relancée.",
      errorTitle: "Nous n’avons pas pu envoyer cela tout de suite.",
      errorMessage: "Une erreur est survenue. Veuillez réessayer.",
      errorRetryMessage: "Vos renseignements sont toujours là. Réessayez une fois de plus.",
      expiredTitle: "Vos renseignements enregistrés ont expiré.",
      expiredMessage:
        "Veuillez remplir la demande à nouveau — ça ne prend qu’un instant.",
      restoreErrorTitle: "Nous n’avons pas pu restaurer votre demande.",
      restoreErrorMessage:
        "Veuillez la remplir à nouveau — votre demande précédente n’a pas été envoyée.",
    },
    cancel: {
      confirm: "Voulez-vous vraiment annuler et supprimer cette demande de soumission?",
      button: "Annuler la soumission",
      canceling: "Annulation...",
    },
    capturedSoFar: "Saisi jusqu’ici",
  },

  dashboard: {
    nav: {
      overview: "Aperçu",
      quotes: "Soumissions",
      payments: "Paiements",
      contract: "Contrat",
      rewards: "Récompenses",
      referrals: "Parrainages",
      gallery: "Ma galerie",
      navAria: "Navigation du compte",
      signOut: "Se déconnecter",
    },
    layout: {
      eyebrow: "Espace client privé",
      welcome: "Bon retour,",
      rewardBalance: "Solde de récompenses",
      towardVisit: "pour votre prochaine visite",
      previewMode: "Mode aperçu.",
      previewBody:
        "Connectez Supabase pour activer les comptes en direct, les soumissions enregistrées, les paiements, les récompenses et les galeries.",
    },
    overview: {
      rewardPoints: "Points de récompense",
      value: "valeur",
      activeQuotes: "Soumissions actives",
      outstanding: "À régler",
      awaitingPayment: "En attente de paiement",
      allSettled: "Tout est réglé",
      recentQuotes: "Soumissions récentes",
      viewAll: "Tout voir",
      noQuotesTitle: "Aucune soumission pour l’instant",
      noQuotesBody:
        "Envoyez les services à faire réviser et Beaumont confirmera une soumission écrite.",
      requestQuote: "Demander une soumission",
      quoteFallback: "Soumission",
      pendingReview: "En attente de révision",
      referEarn: "Parrainez et gagnez",
      referBody: "Partagez votre code et vous gagnez tous les deux",
      pointsOnFirstJob: "points dès leur premier travail.",
      getReferralLink: "Obtenir votre lien de parrainage",
      needVisit: "Besoin d’une autre visite?",
      needVisitBody:
        "Envoyez une nouvelle portée à réviser et échangez vos points une fois la soumission confirmée.",
      newQuoteRequest: "Nouvelle demande de soumission",
    },
    contract: {
      noContractTitle: "Aucun contrat pour l’instant",
      noContractBody:
        "Lorsque vous acceptez une soumission, votre entente de service apparaîtra ici pour révision et signature électronique.",
      viewQuotes: "Voir les soumissions",
      agreementTitle: "Entente de service",
      termsFallback: "Les modalités de votre entente de service apparaîtront ici.",
      signedOn: "Signée le",
      thankYou: ". Merci.",
      signedShort: "Signée",
      agreeLabel:
        "J’ai lu et j’accepte les modalités de cette entente de service.",
      signing: "Signature…",
      eSign: "Signer l’entente électroniquement",
      couldNotSign: "Impossible de signer.",
      errNotEnabled: "Non activé.",
      errSignIn: "Veuillez vous connecter.",
    },
    gallery: {
      noPhotosTitle: "Aucune photo pour l’instant",
      noPhotosBody:
        "Après votre premier nettoyage, nous publierons ici des photos avant et après de votre maison.",
      bookFirst: "Réserver votre premier nettoyage",
    },
    payments: {
      outstanding: "À régler",
      nothingTitle: "Rien à payer",
      nothingBody:
        "Lorsque vous acceptez une soumission, vous pouvez la régler ici par carte, virement ou comptant.",
      viewQuotes: "Voir les soumissions",
      serviceFallback: "Service",
      history: "Historique des paiements",
      noPayments: "Aucun paiement enregistré pour l’instant.",
      errNotEnabled: "Les paiements ne sont pas encore activés.",
      errSignIn: "Veuillez vous connecter.",
      recordedTransfer:
        "Enregistré. Utilisez votre numéro de soumission comme référence de virement; nous confirmerons à la réception des fonds.",
      recordedCash:
        "Enregistré. Payez votre équipe au rendez-vous et nous marquerons le tout comme complété.",
      errCard: "Impossible de démarrer le paiement par carte.",
      settle: "Régler",
      byMethod: "selon le mode de votre choix :",
      payByCard: "Payer par carte",
      cardComingSoon: "Carte (bientôt)",
      bankTransfer: "Virement bancaire",
      cashOnService: "Comptant au service",
      cardNotEnabled:
        "Les paiements par carte ne sont pas encore activés; choisissez le virement ou le comptant.",
      cardActivateNote:
        "Les paiements par carte s’activent une fois les clés Stripe ajoutées. Le virement et le comptant fonctionnent dès aujourd’hui.",
      couldNotStart: "Impossible de démarrer le paiement.",
    },
    quotes: {
      noQuotesTitle: "Aucune soumission pour l’instant",
      noQuotesBody:
        "Vos soumissions enregistrées et demandées apparaîtront ici. Commencez par envoyer les services à faire réviser.",
      requestQuote: "Demander une soumission",
      quoteFallback: "Soumission",
      total: "Total",
      status: "Statut",
      pendingReview: "En attente de révision",
      errUnavailable: "Service indisponible.",
      errMustLogin: "Vous devez être connecté pour annuler une soumission.",
      errNotFound:
        "Soumission introuvable ou vous n’avez pas la permission de l’annuler.",
      errCancelFailed: "Échec de l’annulation de la soumission. Veuillez réessayer.",
      newBack: "← Retour aux soumissions",
      newEyebrow: "Nouvelle demande",
      newTitle: "Demandez votre prochaine visite.",
      newBody:
        "Choisissez les services extérieurs à faire réviser et envoyez la demande directement depuis votre portail client.",
    },
    referrals: {
      yourLink: "Votre lien de parrainage",
      shareBody: "Partagez Beaumont avec vos amis. Lorsqu’ils réservent leur premier nettoyage, vous gagnez tous les deux",
      points: "points.",
      friendsReferred: "Amis parrainés",
      rewardsEarned: "Récompenses gagnées",
      completed: "complété(s)",
      howItWorks: "Comment ça fonctionne",
      step1: "Partagez votre lien ou code unique avec un ami.",
      step2: "Il s’inscrit et réserve son premier nettoyage Beaumont.",
      step3a: "Une fois son travail payé, vous recevez tous les deux",
      step3b: "points.",
      yourCode: "Votre code",
      copy: "Copier",
      copied: "Copié!",
    },
    rewards: {
      pointsBalance: "Solde de points",
      towardVisit: "pour votre prochaine visite",
      redemptionRate: "Taux d’échange",
      pts: "100 pts",
      discount: "= 10 $ de rabais",
      howYouEarn: "Comment vous gagnez",
      activity: "Activité",
      noActivityTitle: "Aucune activité pour l’instant",
      noActivityBody:
        "Gagnez vos premiers points en créant un compte et en réservant un nettoyage.",
      requestQuote: "Demander une soumission",
      createAccount: "Créer un compte",
      acceptQuote: "Accepter une soumission",
      completedJob: "Travail complété",
      successfulReferral: "Parrainage réussi",
    },
    rewardsShowcase: {
      eyebrow: "Récompenses Beaumont",
      heading: "Chaque nettoyage vous rapporte davantage",
      bodyA:
        "Accumulez des points à l’inscription, pour les travaux complétés et les parrainages. Chaque tranche de 100 points vaut 10 $ pour vos prochaines visites. Parrainez un ami et vous gagnez tous les deux",
      bodyB: "points.",
      createAccount: "Créer votre compte",
      startQuote: "Commencer une soumission",
      howYouEarn: "Comment vous gagnez",
    },
  },

  admin: {
    nav: {
      inbox: "Boîte de réception",
      clients: "Clients",
      jobs: "Travaux",
      payments: "Paiements",
      settings: "Paramètres",
    },
    gate: {
      noBackend:
        "Connectez Supabase pour activer le panneau d’administration du personnel (voir README).",
      signedOut:
        "Veuillez vous connecter avec un compte du personnel pour accéder à l’administration.",
      notStaff:
        "Cette zone est réservée au personnel de Beaumont. Votre compte n’a pas d’accès administrateur.",
      staffOnly: "Personnel seulement",
      home: "Accueil",
      signIn: "Se connecter",
    },
    inbox: {
      title: "Boîte de réception",
      description:
        "Traitez les demandes de soumission, de la première révision au travail accepté. Ouvrez une soumission pour modifier le prix, réutiliser une tarification passée, ajouter des notes du personnel et planifier.",
      findClient: "Trouver un client",
      needsQuote: "Soumission requise",
      sent: "Envoyée",
      accepted: "Acceptée",
      scheduled: "Planifiée",
      awaitingPay: "Paiement attendu",
      noWorkTitle: "Aucun travail actif",
      noWorkBody:
        "Les nouvelles demandes de soumission des clients et les travaux actifs apparaîtront ici.",
      needsQuoteBody:
        "Fixez un prix final ou réutilisez une soumission précédente correspondante, puis envoyez-la.",
      sentWaiting: "Envoyée, en attente du client",
      sentWaitingBody:
        "Faites un suivi, renvoyez au besoin, ou marquez comme acceptée une fois que le client est d’accord.",
      acceptedNeedsScheduling: "Acceptée, à planifier",
      acceptedBody: "Planifiez le travail depuis la page de détail de la soumission.",
      scheduledBody: "Complétez le travail une fois le service terminé.",
      quoteRequestFallback: "Demande de soumission",
      addressUnavailable: "Adresse indisponible",
      serviceNotRecorded: "Service non consigné",
      needsPrice: "Prix requis",
      email: "Courriel",
      phone: "Téléphone",
      requested: "Demandée",
      previousMatch: "Correspondance précédente :",
      usePrevious: "Utiliser la soumission précédente",
      openQuote: "Ouvrir la soumission",
      viewClient: "Voir le client",
      sendQuote: "Envoyer la soumission",
      markAccepted: "Marquer acceptée",
      markCompleted: "Marquer complété",
      completed: "Complété",
    },
    clients: {
      title: "Clients",
      description:
        "Recherchez les comptes clients, ouvrez le contexte de soutien et confirmez les totaux des soumissions précédentes avant de répondre.",
      openInbox: "Ouvrir la boîte de réception",
      searchPlaceholder:
        "Rechercher par nom, courriel, téléphone, adresse, service ou statut",
      search: "Rechercher",
      clear: "Effacer",
      clientsShown: "Clients affichés",
      quotesShown: "Soumissions affichées",
      quotedValue: "Valeur soumissionnée",
      noMatchTitle: "Aucun client correspondant",
      noMatchBody:
        "Essayez un autre nom, courriel, téléphone, adresse ou service.",
      noClientsTitle: "Aucun client pour l’instant",
      noClientsBody:
        "Les comptes clients et les demandes de soumission apparaîtront ici.",
      viewAccount: "Voir le compte",
      noEmail: "Aucun courriel au dossier",
      quotes: "Soumissions",
      lastQuote: "Dernière soumission",
      lastTotal: "Dernier total",
      reviewNeeded: "Révision requise",
      paid: "Payé",
      points: "Points",
      none: "Aucune",
      latestRequest: "Dernière demande :",
      at: "à ",
      quoteOnly: "Soumission seulement",
      serviceFallback: "Service non consigné",
    },
    clientDetail: {
      backToClients: "Retour aux clients",
      openRequests: "Ouvrir les demandes",
      quotes: "Soumissions",
      quotedValue: "Valeur soumissionnée",
      paid: "Payé",
      points: "Points",
      quoteReference: "Soumission de référence",
      latestPriced: "Dernière soumission chiffrée",
      referenceHint:
        "Utilisez ceci comme référence de soutien lorsque le même client demande la même adresse, le même service et la même portée.",
      date: "Date",
      service: "Service",
      address: "Adresse",
      frequency: "Fréquence",
      openReference: "Ouvrir la soumission de référence",
      recentPriced: "Historique chiffré récent",
      noPricedTitle: "Aucune soumission chiffrée pour l’instant",
      noPricedBody:
        "Des demandes passées existent, mais aucune n’a de total confirmé. Révisez la portée avant d’envoyer un prix.",
      staffNotes: "Notes du personnel",
      staffNotesPlaceholder:
        "Notes réservées au personnel sur les préférences, l’accès, le stationnement, une tarification spéciale ou le contexte de soutien.",
      saveClientNotes: "Enregistrer les notes du client",
      clientNotesFallback:
        "Les notes du client nécessitent un profil de compte complet. Utilisez les notes de soumission pour les dossiers sans compte.",
      accountDetails: "Détails du compte",
      profileId: "ID de profil",
      quoteOnlyRecord: "Dossier sans compte",
      role: "Rôle",
      name: "Nom",
      email: "Courriel",
      phone: "Téléphone",
      created: "Créé",
      referralCode: "Code de parrainage",
      supportContext: "Contexte de soutien",
      lastRequest: "Dernière demande",
      lastStatus: "Dernier statut",
      noRequests: "Aucune demande",
      lastService: "Dernier service",
      lastAddress: "Dernière adresse",
      payments: "Paiements",
      contracts: "Contrats",
      pastQuotes: "Soumissions passées",
      noHistoryTitle: "Aucun historique de soumission",
      noHistoryBody: "Ce compte n’a encore aucune demande de soumission.",
      reviewItems: "Éléments à réviser : ",
      scopeDetails: "Détails de la portée",
      requester: "Demandeur",
      contactEmail: "Courriel de contact",
      accountEmail: "Courriel du compte",
      quoteId: "ID de soumission",
      sourceZone: "Zone d’origine",
      notification: "Notification",
      noPayments: "Aucun paiement enregistré.",
      rewards: "Récompenses",
      noRewards: "Aucune entrée au registre de récompenses.",
      referrals: "Parrainages",
      noReferrals: "Aucun parrainage enregistré.",
      noContracts: "Aucun contrat enregistré.",
      created2: "Créé ",
      signed: "Signé ",
      rewardGranted: "Récompense accordée",
      pendingReward: "Récompense en attente",
    },
    doorTags: {
      title: "Programme d’accroche-portes",
      description:
        "Générez des accroche-portes QR haut de gamme par quartier. Chaque étiquette mène directement à l’outil de demande de soumission préréglé pour cette zone et est suivie, ce qui permet de retracer l’entonnoir du balayage à la réservation. Générez, puis imprimez sur du papier épais et découpez l’encoche du haut.",
      generateHeading: "Générer des accroche-portes",
      generateDescription:
        "Une zone par ligne. Chaque étiquette reçoit un QR unique qui préremplit l’outil de soumission avec sa zone et suit les balayages → soumissions → réservations.",
      zonesLabel: "Zones / quartiers",
      perZone: "Par zone",
      generate: "Générer",
      generating: "Génération…",
      printTags: "Imprimer",
      tags: "étiquettes",
      scanFree: "Balayez pour une soumission gratuite de",
      thisHome: "cette",
      home: "maison",
    },
    gallery: {
      existingItems: "Éléments existants",
      noItems: "Aucun élément de galerie pour l’instant.",
      before: "Avant",
      after: "Après",
      dragToCompare: "Glissez pour comparer l’avant et l’après",
      untitled: "Sans titre",
      featured: "En vedette",
      addHeading: "Ajouter un avant / après",
      addDescription:
        "Collez les URL d’images (du bucket gallery de Supabase Storage ou d’ailleurs). Les éléments en vedette apparaissent sur le site public.",
      beforeUrl: "URL avant",
      afterUrl: "URL après",
      caption: "Légende",
      urlPlaceholder: "https://…",
      featureOnSite: "Mettre en vedette sur le site public",
      addItem: "Ajouter l’élément",
      adding: "Ajout…",
      added: "Ajouté ✓",
    },
    jobs: {
      title: "Travaux",
      description:
        "Les soumissions acceptées deviennent des travaux. Planifiez-les depuis la page de soumission et marquez-les comme complétés une fois le service terminé.",
      inbox: "Boîte de réception",
      noJobsTitle: "Aucun travail pour l’instant",
      noJobsBody: "Les soumissions acceptées et planifiées apparaîtront ici.",
      needsScheduling: "À planifier",
      scheduled: "Planifié",
      completed: "Complété",
      jobFallback: "Travail",
      addressNotRecorded: "Adresse non consignée",
      serviceNotRecorded: "Service non consigné",
      noPrice: "Aucun prix",
      openJob: "Ouvrir le travail",
      markCompleted: "Marquer complété",
      scheduledPrefix: "Planifié : ",
    },
    payments: {
      title: "Paiements",
      description:
        "Confirmez les paiements comptant et par virement, puis gardez les dossiers de soumission/travail synchronisés.",
      jobs: "Travaux",
      awaiting: "En attente",
      paid: "Payé",
      paidTotal: "Total payé",
      noPaymentsTitle: "Aucun paiement pour l’instant",
      noPaymentsBody: "Les paiements des clients apparaîtront ici une fois créés.",
      createdPrefix: "Créé ",
      paidPrefix: "Payé ",
      markPaid: "Marquer payé",
      openQuote: "Ouvrir la soumission",
    },
    pricing: {
      title: "Tarification",
      description:
        "Modifiez les champs de tarification interne pour chaque service. Les demandes des clients restent basées sur la révision jusqu’à ce qu’une soumission finale soit confirmée.",
      noServicesTitle: "Aucun service",
      noServicesBody: "Exécutez la migration de la base de données pour amorcer le catalogue de services.",
      basePrice: "Prix de base ($)",
      legacyArea: "Champ de superficie hérité ($)",
      multiplier: "Multiplicateur",
    },
    quoteDetail: {
      backToInbox: "Retour à la boîte de réception",
      viewClient: "Voir le client",
      finalQuote: "Soumission finale",
      status: "Statut",
      requested: "Demandée",
      scheduled: "Planifiée",
      reviewAndSend: "Réviser et envoyer",
      reviewDescription:
        "Fixez la soumission finale, gardez le contexte réservé au personnel et faites avancer la demande dans le flux de travail réel.",
      customer: "Client",
      name: "Nom",
      email: "Courriel",
      phone: "Téléphone",
      accountEmail: "Courriel du compte",
      markAccepted: "Marquer acceptée",
      markScheduled: "Marquer planifiée",
      markCompleted: "Marquer complété",
      previousMatch: "Correspondance de soumission précédente",
      keepConsistent: "Utilisez ceci pour garder une tarification cohérente",
      usePrevious: "Utiliser la soumission précédente",
      noMatch:
        "Aucune soumission chiffrée correspondante pour le même client, la même adresse et le même service.",
      requestScope: "Portée de la demande",
      service: "Service",
      visitRhythm: "Rythme des visites",
      sourceZone: "Zone d’origine",
      notification: "Notification",
      reviewItems: "Éléments à réviser : ",
      customerScope: "Portée du client",
      pricedHistory: "Historique chiffré",
      noPricedTitle: "Aucune soumission chiffrée précédente",
      noPricedBody:
        "Une fois que ce client aura une soumission confirmée, elle apparaîtra ici pour assurer la cohérence future.",
      useThisPrice: "Utiliser ce prix",
      paymentsOnQuote: "Paiements sur cette soumission",
      noPaymentsLinked: "Aucun paiement lié pour l’instant.",
    },
    settings: {
      title: "Paramètres",
      description:
        "Les outils d’administration moins utilisés se trouvent ici. Le travail de soutien quotidien devrait se faire dans la Boîte de réception, les Clients, les Travaux et les Paiements.",
      galleryTitle: "Galerie marketing",
      galleryDescription:
        "Gérez les images avant-après affichées sur le site public.",
      doorTagTitle: "Codes QR d’accroche-portes",
      doorTagDescription:
        "Générez des codes QR de sensibilisation et des liens d’arrivée pour le marketing terrain.",
      pricingTitle: "Configuration de la tarification",
      pricingDescription:
        "Réglages de tarification hérités. À utiliser seulement si vous ramenez intentionnellement la tarification par formule.",
      open: "Ouvrir",
      staffAccess: "Accès du personnel",
      staffAccessBody:
        "Les nouvelles inscriptions sont des clients par défaut. Accordez l’accès du personnel manuellement dans Supabase en réglant public.profiles.role à staff pour un compte vérifié.",
    },
    quoteReviewForm: {
      needsQuote: "Soumission requise",
      sentToCustomer: "Envoyée au client",
      accepted: "Acceptée",
      scheduled: "Planifiée",
      completed: "Complété",
      finalAmount: "Montant de la soumission finale",
      status: "Statut",
      scheduledDate: "Date planifiée",
      internalNotes: "Notes internes du personnel",
      notesPlaceholder:
        "Que doit savoir le personnel avant de soumissionner, planifier ou répondre?",
      save: "Enregistrer",
      saving: "Enregistrement...",
      saveAndSend: "Enregistrer et envoyer la soumission",
      working: "Traitement...",
      savedAndSent: "Soumission enregistrée et envoyée.",
      savedOnly: "Soumission enregistrée.",
      actionFailed: "L’action a échoué.",
    },
    actionButton: {
      done: "Terminé",
    },
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Localized label for a DB status value, falling back to the raw value. */
export function statusLabel(dict: Dictionary, status: string): string {
  const map = dict.statuses as Record<string, string>;
  return map[status] ?? status;
}

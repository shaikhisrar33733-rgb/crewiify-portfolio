// case-studies-data.js - Reusable Case Study Repository & CMS-ready Data Architecture for CREWiiFY

/**
 * ============================================================================
 * CREWiiFY CASE STUDY DATA ARCHITECTURE & SCHEMA SPECIFICATION (V2)
 * ============================================================================
 * 
 * Future case studies require ONLY adding a data object to `caseStudiesData`.
 * The renderer automatically chooses the template, arranges dynamic grids, and scales
 * to 40–50+ case studies without touching JS or CSS.
 * 
 * ----------------------------------------------------------------------------
 * A. RESULT-BASED SCHEMA TEMPLATE (SEO, PPC, Ads, Performance Marketing)
 * ----------------------------------------------------------------------------
 * {
 *   id: "unique-slug",
 *   type: "result",                     // "result" | "creative"
 *   category: "SEO",                    // Category identifier
 * 
 *   // Listing Card Properties (Preserved for seamless masonry grid)
 *   title: "Client Display Title",
 *   subtitle: "Service Subtitle",
 *   cardSpan: "tall",                   // "tall" | "medium"
 *   image: "assets/case-studies/...",   // Card cover thumbnail
 *   imagePosition: "center center",     // CSS object-position for thumbnail
 *   description: "1-2 sentence card overview summary.",
 *   result: "1,356",                    // Card primary badge value
 *   resultLabel: "Interactions in 45 Days", // Card primary badge label
 *   metrics: [                          // Metric pills for card
 *     { value: "1,356", label: "Interactions" },
 *     { value: "469", label: "Calls" }
 *   ],
 *   services: ["Local SEO", "Citation Building"],
 * 
 *   // Client Details
 *   client: {
 *     name: "Paladium Janseva Hospital",
 *     industry: "Healthcare"
 *   },
 * 
 *   // Expanded Modal Hero Section
 *   hero: {
 *     eyebrow: "LOCAL SEO",
 *     timeframe: "45 DAYS",
 *     headline: "More Visibility. More Patients.",
 *     overview: "A newly launched hospital needed to establish local search visibility and turn Google discovery into measurable patient actions.",
 *     imageMode: "cutout",              // "cutout" | "photo" | "screen" | "creative"
 *     coverImage: "assets/case-studies/...",
 *     coverImageAlt: "Paladium Janseva Hospital Building Highlights"
 *   },
 * 
 *   // Results & Metrics Section (Result template only)
 *   results: {
 *     heading: "RESULTS",
 *     timeframeNote: "Measured in 45 days.",
 *     primary: {
 *       value: "1,356",
 *       label: "Business Profile Interactions"
 *     },
 *     secondary: [
 *       { value: "469", label: "CALLS" },
 *       { value: "592", label: "DIRECTIONS" },
 *       { value: "295", label: "WEBSITE CLICKS" }
 *     ],
 *     proofImages: [                    // Real client evidence screenshots
 *       {
 *         src: "assets/case-studies/...",
 *         alt: "Analytics Proof",
 *         caption: "Google Business Profile Interactions & Direct Inquiries"
 *       }
 *     ]
 *   },
 * 
 *   // Challenge & Problem Starting Point
 *   challenge: {
 *     summary: "The clinic had minimal digital presence and was struggling to generate consistent patient inquiries through online channels.",
 *     points: [
 *       "Struggling clinic call volume",
 *       "Unranked for local specialist keywords",
 *       "Incomplete Google Business Profile",
 *       "Zero structured local citations"
 *     ]
 *   },
 * 
 *   // Intervention Strategy / Approach (Adaptive 1-col or 2-col compact grid)
 *   approach: [
 *     {
 *       title: "GMB Optimization & Verification",
 *       description: "Re-indexed treatment categories, updated clinic hours, and verified core practitioner credentials."
 *     },
 *     {
 *       title: "Local Search Intent Keywords",
 *       description: "Captured high-urgency keywords for orthopedic consults and surgical second opinions."
 *     }
 *   ],
 * 
 *   // Optional Work / Execution Visuals
 *   work: [
 *     {
 *       src: "assets/case-studies/...",
 *       alt: "Execution Visual",
 *       caption: "Performance Growth Indicators"
 *     }
 *   ],
 * 
 *   // Small Closing CTA Row
 *   cta: {
 *     headline: "Have a similar challenge?",
 *     text: "START A PROJECT",
 *     link: "/contact"
 *   }
 * }
 * ============================================================================
 */

/**
 * Category Configuration Table
 * Future categories are preserved with enabled: false for seamless launch control.
 */
export const CASE_STUDY_CATEGORIES = [
  { id: 'all', label: 'All Work', enabled: true },
  { id: 'SEO', label: 'SEO', enabled: true },
  { id: 'PPC Management & Growth', label: 'PPC Management & Growth', enabled: true },
  { id: 'Web Development', label: 'Web Development', enabled: false },
  { id: 'WhatsApp Automation', label: 'WhatsApp Automation', enabled: false },
  { id: 'WordPress', label: 'WordPress', enabled: false },
  { id: 'Shopify', label: 'Shopify', enabled: false }
];

/**
 * The Real Client Case Studies Data Architecture
 * Fully dynamic and ready for headless CMS / WordPress REST API integration.
 */
export const caseStudiesData = [
  {
    id: "paladium-janseva",
    category: "SEO",
    type: "result",

    client: {
      name: "Paladium Janseva Hospital",
      industry: "Healthcare"
    },

    title: "Paladium Janseva Hospital",
    subtitle: "Local SEO & Google Business Profile Optimization",
    cardSpan: "tall",
    image: "https://shaikhisrar33733-rgb.github.io/crewiify-portfolio/assets/case-studies/palladium/coverimage.jpeg",
    imagePosition: "center 25%",
    description: "Helped a newly launched hospital generate patients, consultations, and local visibility in 45 days through Google Business Profile optimization.",
    result: "1,356",
    resultLabel: "Interactions in 45 Days",
    metrics: [
      { value: "1,356", label: "Business Profile Interactions" },
      { value: "469", label: "Direct Phone Calls" },
      { value: "592", label: "Direction Requests" },
      { value: "295", label: "Website Clicks" }
    ],
    overview: "A newly launched hospital needed to establish local search visibility and turn Google discovery into measurable patient actions.",
    services: ["Local SEO", "Google Business Profile Optimization", "Citation Building"],

    hero: {
      eyebrow: "LOCAL SEO",
      timeframe: "45 DAYS",
      headline: "More Visibility. More Patients.",
      overview: "A newly launched hospital needed to establish local search visibility and turn Google discovery into measurable patient actions.",
      description: "A newly launched hospital needed to establish local search visibility and turn Google discovery into measurable patient actions.",
      imageMode: "cutout",
      coverImage: "https://shaikhisrar33733-rgb.github.io/crewiify-portfolio/assets/case-studies/palladium/coverimage.jpeg",
      coverImageAlt: "Paladium Janseva Hospital Clinical Team and Growth Highlights"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured in 45 days.",
      primary: {
        value: "1,356",
        label: "Business Profile Interactions"
      },
      secondary: [
        {
          value: "469",
          label: "CALLS"
        },
        {
          value: "592",
          label: "DIRECTIONS"
        },
        {
          value: "295",
          label: "WEBSITE CLICKS"
        }
      ],
      proofImages: [
        {
          src: "assets/case-studies/palladium/stat1.png",
          alt: "Google Business Profile Interactions Analytics - 1,356 Total Interactions",
          caption: "Google Business Profile Interactions & Direct Inquiries"
        },
        {
          src: "assets/case-studies/palladium/stat2.png",
          alt: "Google Maps Route Direction Requests Analytics - 592 Direction Requests",
          caption: "Google Maps Route & Direction Requests"
        }
      ]
    },

    challenge: {
      summary: "The clinic had minimal digital presence and was struggling to generate consistent patient inquiries through online channels.",
      points: [
        "Struggling clinic call volume",
        "Unranked for local specialist keywords",
        "Incomplete Google Business Profile",
        "Zero structured local citations"
      ]
    },

    approach: [
      {
        title: "GMB Optimization & Verification",
        description: "Re-indexed treatment categories, updated clinic hours, and verified core practitioner credentials."
      },
      {
        title: "Local Search Intent Keywords",
        description: "Captured high-urgency keywords for orthopedic consults and surgical second opinions."
      },
      {
        title: "Local Citations & Map Visibility",
        description: "Built consistent citations and improved Google Maps relevance signals."
      },
      {
        title: "Review Generation Strategy",
        description: "Implemented ethical review workflows to build trust and improve visibility."
      }
    ],

    // Backward compatibility aliases
    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Struggling clinic call volume",
        "Unranked for local specialist keywords",
        "Incomplete Google Business Profile",
        "Zero structured local citations"
      ]
    },

    strategy: [
      {
        title: "01 — GMB Optimization & Verification",
        description: "Re-indexed treatment categories, updated clinic hours, and verified core practitioner credentials."
      },
      {
        title: "02 — Local Search Intent Keywords",
        description: "Captured high-urgency keywords for orthopedic consults and surgical second opinions."
      },
      {
        title: "03 — Local Citations & Map Visibility",
        description: "Built consistent citations and improved Google Maps relevance signals."
      },
      {
        title: "04 — Review Generation Strategy",
        description: "Implemented ethical review workflows to build trust and improve visibility."
      }
    ],

    work: [
      {
        src: "assets/case-studies/palladium/work1.png",
        alt: "Paladium Janseva Hospital Performance Execution & 100% Growth Metric Card",
        caption: "Performance Growth Indicators Across Interactions, Calls, and Navigation"
      }
    ],

    cta: {
      headline: "Have a similar challenge?",
      subtext: "Let's talk about it.",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  },
  {
    id: "orthopedic-doctor-seo",
    category: "SEO",
    type: "result",

    client: {
      name: "Orthopedic Doctor Clinic",
      industry: "Healthcare"
    },

    title: "Orthopedic Doctor",
    subtitle: "Local SEO & Google Business Profile Optimization",
    cardSpan: "medium",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 22%",
    description: "Optimized local SEO and Google Business Profile to capture patient searches, climbing clinic calls from 60 to 345 in four months.",
    result: "345",
    resultLabel: "Monthly Calls",
    metrics: [
      { value: "345", label: "Monthly Calls" },
      { value: "60 → 345", label: "4-Month Growth" }
    ],
    overview: "A digital agency brought us an orthopedic clinic struggling to get the phone to ring. We optimized their local SEO and Google Business Profile to rank for the searches patients were actually making.",
    services: ["Local SEO", "Google Business Profile Optimization"],

    hero: {
      eyebrow: "LOCAL SEO",
      timeframe: "4 MONTHS",
      headline: "More Patient Inquiries. Predictable Clinic Calls.",
      overview: "How we optimized local search intent and Google Maps placement for an orthopedic clinic to climb monthly calls by 475%.",
      description: "How we optimized local search intent and Google Maps placement for an orthopedic clinic to climb monthly calls by 475%.",
      imageMode: "photo",
      coverImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85",
      coverImageAlt: "Orthopedic Doctor Consultation"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured in 4 months.",
      primary: {
        value: "345",
        label: "Monthly Patient Calls"
      },
      secondary: [
        {
          value: "+475%",
          label: "INQUIRY GROWTH"
        },
        {
          value: "#1–3",
          label: "LOCAL PACK RANK"
        },
        {
          value: "60 → 345",
          label: "CALL SURGE"
        }
      ],
      proofImages: []
    },

    challenge: {
      summary: "An established orthopedic practice was receiving minimal patient call volume despite high regional search demand for surgical consultations.",
      points: [
        "Struggling clinic call volume",
        "Unranked for local specialist keywords",
        "Incomplete Google Business profile",
        "Zero structured local citations"
      ]
    },

    approach: [
      {
        title: "GMB Optimization & Verification",
        description: "Re-indexed treatment categories, updated clinic hours, and verified core practitioner credentials."
      },
      {
        title: "Local Search Intent Keywords",
        description: "Captured high-urgency keywords for orthopedic consults and surgical second opinions."
      },
      {
        title: "Medical Directory Citations",
        description: "Standardized NAP footprint across leading healthcare and regional portals."
      }
    ],

    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Struggling clinic call volume",
        "Unranked for local specialist keywords",
        "Incomplete Google Business profile",
        "Zero structured local citations"
      ]
    },

    strategy: [
      {
        title: "01 — GMB Optimization & Verification",
        description: "Re-indexed treatment categories, updated clinic hours, and verified core practitioner credentials."
      },
      {
        title: "02 — Local Search Intent Keywords",
        description: "Captured high-urgency keywords for orthopedic consults and surgical second opinions."
      },
      {
        title: "03 — Medical Directory Citations",
        description: "Standardized NAP footprint across leading healthcare and regional portals."
      }
    ],

    work: [],

    cta: {
      headline: "Have a similar challenge?",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  },
  {
    id: "organic-farm-resort-seo",
    category: "SEO",
    type: "result",

    client: {
      name: "Organic Farm & Education Resort",
      industry: "Hospitality & Agri-Tourism"
    },

    title: "Organic Farm Resort",
    subtitle: "On-Page Restructuring & First-Page Keyword Rankings",
    cardSpan: "tall",
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    description: "Rebuilt on-page structure and ran sustained off-page SEO, securing 16 first-page Google rankings with several holding #1–2 spots for over a year.",
    result: "16",
    resultLabel: "First-Page Keywords",
    metrics: [
      { value: "16", label: "First-Page Keywords" },
      { value: "#1–2 Spots", label: "Held For Over A Year" }
    ],
    overview: "A digital agency brought us an organic-farming education client with weak search visibility across their key Maharashtra markets.",
    services: ["On-Page SEO Structure", "Off-Page SEO", "Keyword Tracking"],

    hero: {
      eyebrow: "ORGANIC SEO",
      timeframe: "12 MONTHS",
      headline: "Dominating Search For Regional Agri-Tourism.",
      overview: "Rebuilding on-page hierarchy and establishing authority signals to maintain top organic rankings for over a year.",
      description: "Rebuilding on-page hierarchy and establishing authority signals to maintain top organic rankings for over a year.",
      imageMode: "photo",
      coverImage: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=85",
      coverImageAlt: "Organic Farm Resort Landscape"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured across 12 months sustained growth.",
      primary: {
        value: "16",
        label: "First-Page Google Rankings"
      },
      secondary: [
        {
          value: "#1–2",
          label: "TOP SPOT POSITIONS"
        },
        {
          value: "12+ Mo",
          label: "RANKING RETENTION"
        },
        {
          value: "3.2x",
          label: "ORGANIC TRAFFIC"
        }
      ],
      proofImages: []
    },

    challenge: {
      summary: "A premium eco-resort was relying almost entirely on costly third-party OTAs due to negligible organic keyword rankings.",
      points: [
        "Weak search visibility in key regional markets",
        "Disorganized content architecture",
        "Zero first-page rankings for commercial terms",
        "High dependency on paid listings"
      ]
    },

    approach: [
      {
        title: "Information Architecture Overhaul",
        description: "Restructured site hierarchy around agri-tourism experiences and seasonal workshop bookings."
      },
      {
        title: "Technical & Core Web Vitals Fixes",
        description: "Optimized mobile page speed, meta schemas, and image payloads for crawl performance."
      },
      {
        title: "Contextual Link Building",
        description: "Earned authoritative travel and lifestyle editorial links to cement regional ranking dominance."
      }
    ],

    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Weak search visibility in key regional markets",
        "Disorganized content architecture",
        "Zero first-page rankings for commercial terms",
        "High dependency on paid listings"
      ]
    },

    strategy: [
      {
        title: "01 — Information Architecture Overhaul",
        description: "Restructured site hierarchy around agri-tourism experiences and seasonal workshop bookings."
      },
      {
        title: "02 — Technical & Core Web Vitals Fixes",
        description: "Optimized mobile page speed, meta schemas, and image payloads for crawl performance."
      },
      {
        title: "03 — Contextual Link Building",
        description: "Earned authoritative travel and lifestyle editorial links to cement regional ranking dominance."
      }
    ],

    work: [],

    cta: {
      headline: "Have a similar challenge?",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  },
  {
    id: "resort-local-seo",
    category: "SEO",
    type: "result",

    client: {
      name: "Regional Hospitality Resort",
      industry: "Hospitality"
    },

    title: "Resort",
    subtitle: "Competitive Local SEO & Keyword Targeting",
    cardSpan: "medium",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 45%",
    description: "Built out local SEO and off-page signals from a standing start, breaking into top-20 positions for competitive getaway searches.",
    result: "Top 20",
    resultLabel: "Local Search Rankings",
    metrics: [
      { value: "Top 20", label: "Local Search Rankings" },
      { value: "Dense Market", label: "Getaway Terms" }
    ],
    overview: "A digital agency brought us a resort competing for high-intent local searches across the Bhivpuri, Badlapur, and Ambernath belt.",
    services: ["Local SEO", "Keyword Targeting", "Off-Page Signals"],

    hero: {
      eyebrow: "LOCAL SEO",
      timeframe: "3 MONTHS",
      headline: "Breaking Into Top Search In A Dense Resort Belt.",
      overview: "From a standing start to top-20 local rankings across competitive weekend getaway terms.",
      description: "From a standing start to top-20 local rankings across competitive weekend getaway terms.",
      imageMode: "photo",
      coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85",
      coverImageAlt: "Luxury Resort Swimming Pool and Villas"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured in 3 months.",
      primary: {
        value: "Top 20",
        label: "Local Search Rankings"
      },
      secondary: [
        {
          value: "4.8★",
          label: "REVIEW RATING"
        },
        {
          value: "100%",
          label: "NEW SEARCH FOOTPRINT"
        }
      ],
      proofImages: []
    },

    challenge: {
      summary: "A newly opened boutique property was virtually invisible in a congested tourism belt packed with established resort competitors.",
      points: [
        "Brand-new location with no prior web presence",
        "Dense local competition in regional getaway belt",
        "Zero Google Maps ranking or citations"
      ]
    },

    approach: [
      {
        title: "Geographic Entity Optimization",
        description: "Anchored location coordinates and high-intent destination search keywords."
      },
      {
        title: "Local Business Citations",
        description: "Built accurate directory listings across top tourism and regional map aggregators."
      }
    ],

    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Brand-new location with no prior web presence",
        "Dense local competition in regional getaway belt",
        "Zero Google Maps ranking or citations"
      ]
    },

    strategy: [
      {
        title: "01 — Geographic Entity Optimization",
        description: "Anchored location coordinates and high-intent destination search keywords."
      },
      {
        title: "02 — Local Business Citations",
        description: "Built accurate directory listings across top tourism and regional map aggregators."
      }
    ],

    work: [],

    cta: {
      headline: "Have a similar challenge?",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  },
  {
    id: "leading-cruise-line-ppc",
    category: "PPC Management & Growth",
    type: "result",

    client: {
      name: "Global Cruise Travel Brand",
      industry: "Travel & Cruise"
    },

    title: "A Leading Cruise Line",
    subtitle: "High-Performance PPC Campaign Restructuring & Conversion Tracking",
    cardSpan: "tall",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    description: "Rebuilt conversion tracking and restructured intent signals to drive cabin bookings, achieving a 9x ROAS and $550K in monthly PPC revenue.",
    result: "9x",
    resultLabel: "ROAS",
    metrics: [
      { value: "9x", label: "Return on Ad Spend" },
      { value: "$550K", label: "Monthly PPC Revenue" }
    ],
    overview: "A digital agency came to us with a high-value client, one of the biggest names in cruise travel, that was bleeding conversions through broken tracking and misread buying signals.",
    services: ["Conversion Tracking Overhaul", "PPC Campaign Restructuring", "Purchase Intent Optimization"],

    hero: {
      eyebrow: "PPC & PAID MEDIA",
      timeframe: "60 DAYS",
      headline: "Restructuring Funnels To Unlock 9x Return On Ad Spend.",
      overview: "How we fixed broken conversion signals and rebuilt high-intent PPC campaigns to generate $550K/month in cruise bookings.",
      description: "How we fixed broken conversion signals and rebuilt high-intent PPC campaigns to generate $550K/month in cruise bookings.",
      imageMode: "photo",
      coverImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=85",
      coverImageAlt: "Luxury Cruise Ship at Sea"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured in 60 days.",
      primary: {
        value: "9x",
        label: "Return on Ad Spend (ROAS)"
      },
      secondary: [
        {
          value: "$550K",
          label: "MONTHLY PPC REVENUE"
        },
        {
          value: "-38%",
          label: "COST PER ACQUISITION"
        },
        {
          value: "100%",
          label: "TRACKING ACCURACY"
        }
      ],
      proofImages: []
    },

    challenge: {
      summary: "A global travel provider was burning six-figure ad budgets with misattributed conversions and poor purchase intent segmentation.",
      points: [
        "Broken conversion tracking and misattributed ad spend",
        "Low return on ad spend across luxury itineraries",
        "Wasted budget on broad low-intent search terms"
      ]
    },

    approach: [
      {
        title: "Server-Side Conversion Tracking",
        description: "Implemented high-fidelity server-side tracking to capture exact booking values and customer journeys."
      },
      {
        title: "Intent Signal Campaign Restructure",
        description: "Isolated high-yield cabin search terms from generic exploratory queries."
      },
      {
        title: "Value-Based Bidding Strategy",
        description: "Trained smart bidding algorithms on high-margin suite and balcony reservations."
      }
    ],

    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Broken conversion tracking and misattributed ad spend",
        "Low return on ad spend across luxury itineraries",
        "Wasted budget on broad low-intent search terms"
      ]
    },

    strategy: [
      {
        title: "01 — Server-Side Conversion Tracking",
        description: "Implemented high-fidelity server-side tracking to capture exact booking values and customer journeys."
      },
      {
        title: "02 — Intent Signal Campaign Restructure",
        description: "Isolated high-yield cabin search terms from generic exploratory queries."
      },
      {
        title: "03 — Value-Based Bidding Strategy",
        description: "Trained smart bidding algorithms on high-margin suite and balcony reservations."
      }
    ],

    work: [],

    cta: {
      headline: "Have a similar challenge?",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  },
  {
    id: "leading-multispeciality-hospital-ppc",
    category: "PPC Management & Growth",
    type: "result",

    client: {
      name: "Leading Multispeciality Hospital",
      industry: "Healthcare"
    },

    title: "A Leading Multispeciality Hospital",
    subtitle: "PPC Funnel Rebuild & Conversion Tracking",
    cardSpan: "medium",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 30%",
    description: "Fixed tracking, rebuilt the conversion funnel, and refocused spend on high-converting searches, achieving 7x ROAS and $255K in monthly revenue.",
    result: "7x",
    resultLabel: "ROAS",
    metrics: [
      { value: "7x", label: "Return on Ad Spend" },
      { value: "$255K", label: "Monthly PPC Revenue" }
    ],
    overview: "A digital agency brought us a leading multispeciality hospital running unstructured campaigns with no reliable conversion tracking.",
    services: ["Conversion Tracking Setup", "PPC Funnel Rebuild", "Targeted Ad Spend Optimization"],

    hero: {
      eyebrow: "PPC MANAGEMENT",
      timeframe: "45 DAYS",
      headline: "Eliminating Waste. Maximizing High-Value Patient Consultations.",
      overview: "Restructuring hospital PPC ad funnels to achieve 7x ROAS and $255K in monthly revenue.",
      description: "Restructuring hospital PPC ad funnels to achieve 7x ROAS and $255K in monthly revenue.",
      imageMode: "photo",
      coverImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
      coverImageAlt: "Multispeciality Hospital Modern Facility"
    },

    results: {
      heading: "RESULTS",
      timeframeNote: "Measured in 45 days.",
      primary: {
        value: "7x",
        label: "Return on Ad Spend (ROAS)"
      },
      secondary: [
        {
          value: "$255K",
          label: "MONTHLY REVENUE"
        },
        {
          value: "-42%",
          label: "COST PER LEAD"
        }
      ],
      proofImages: []
    },

    challenge: {
      summary: "A multispeciality hospital group was wasting budget on broad non-converting search terms without procedure-level call attribution.",
      points: [
        "Unstructured campaigns with unsegmented ad groups",
        "No reliable call tracking or form attribution",
        "Significant budget wasted on irrelevant generic queries"
      ]
    },

    approach: [
      {
        title: "Specialty-Focused Ad Groups",
        description: "Segmented cardiology, oncology, and orthopedic search campaigns with tailored landing pages."
      },
      {
        title: "Dynamic Call Tracking Integration",
        description: "Captured keyword-level attribution for high-urgency emergency and consultation calls."
      },
      {
        title: "Negative Keyword Fortification",
        description: "Eliminated informational, job seeker, and non-converting search queries."
      }
    ],

    startingPoint: {
      heading: "FROM ZERO TO VISIBILITY",
      items: [
        "Unstructured campaigns with unsegmented ad groups",
        "No reliable call tracking or form attribution",
        "Significant budget wasted on irrelevant generic queries"
      ]
    },

    strategy: [
      {
        title: "01 — Specialty-Focused Ad Groups",
        description: "Segmented cardiology, oncology, and orthopedic search campaigns with tailored landing pages."
      },
      {
        title: "02 — Dynamic Call Tracking Integration",
        description: "Captured keyword-level attribution for high-urgency emergency and consultation calls."
      },
      {
        title: "03 — Negative Keyword Fortification",
        description: "Eliminated informational, job seeker, and non-converting search queries."
      }
    ],

    work: [],

    cta: {
      headline: "Have a similar challenge?",
      text: "START A PROJECT",
      link: "/contact",
      secondaryText: "Explore More Case Studies"
    }
  }
];

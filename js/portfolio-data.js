/**
 * portfolio-data.js - Central Data Store for CREWiiFY Redesigned Work / Portfolio Showcase
 * 
 * Strict Schema across 4 Categories:
 * 1. portrait-videos (9:16 Vertical Videos / Reels)
 * 2. landscape-videos (16:9 Horizontal Videos / Brand Films)
 * 3. seo-results (Verified Real Analytics & GBP Metrics)
 * 4. websites (Real Client Websites with Browser Mockups & Live Links)
 */

export const portfolioCategories = [
  { id: 'all', label: 'All Work', count: 22 },
  { id: 'portrait-videos', label: 'Portrait Videos', count: 5 },
  { id: 'landscape-videos', label: 'Landscape Videos', count: 4 },
  { id: 'seo-results', label: 'SEO Results', count: 6 },
  { id: 'websites', label: 'Websites', count: 7 }
];

export const portfolioItems = [
  /* ==========================================================================
     CATEGORY 1: PORTRAIT VIDEOS (Vertical 9:16)
     ========================================================================== */
  {
    id: 'portrait-01',
    category: 'portrait-videos',
    categoryLabel: 'Portrait Videos',
    formatBadge: '9:16 REEL',
    title: 'High-Retention Video Hooks & Kinetic Pacing',
    client: 'DTC E-Commerce Client',
    aspectRatio: '9/16',
    videoSrc: 'assets/videos/urban-reel.mp4',
    posterText: 'Kinetic Pacing & Hooks',
    description: 'Raw footage transformed into high-velocity Reels with dynamic karaoke subtitles, custom motion graphics, UI zoom callouts, and audio sync.',
    highlights: [
      { label: 'TURNAROUND', value: '24–48h' },
      { label: 'FORMAT', value: '4K 60fps 9:16' },
      { label: 'BRAND SOP', value: '100% Matched' }
    ]
  },
  {
    id: 'portrait-02',
    category: 'portrait-videos',
    categoryLabel: 'Portrait Videos',
    formatBadge: '9:16 TALKING HEAD',
    title: 'B-Roll Infused Talking Head Viral Edits',
    client: 'Executive Personal Brand',
    aspectRatio: '9/16',
    videoSrc: 'assets/videos/sample-reel.mp4',
    posterText: 'Studio Cut & B-Roll Sync',
    description: 'Multi-cam studio recordings cut down to high-impact 45-second soundbites with contextual B-roll, kinetic zooms, and sound effects.',
    highlights: [
      { label: 'VIRAL HOOKS', value: '3 Angles / Ep' },
      { label: 'CAPTION STYLE', value: 'Karaoke Animated' },
      { label: 'AGENCY MARGIN', value: '65% Retained' }
    ]
  },
  {
    id: 'portrait-03',
    category: 'portrait-videos',
    categoryLabel: 'Portrait Videos',
    formatBadge: '9:16 PRODUCT DEMO',
    title: 'High-Paced SaaS Product Walkthrough',
    client: 'Tech Startup Client',
    aspectRatio: '9/16',
    videoSrc: 'assets/videos/urban-reel.mp4',
    posterText: 'SaaS Feature Walkthrough',
    description: '45-second kinetic product reel with auto-captions, cursor zooms, UI callouts, and seamless audio rhythm pacing.',
    highlights: [
      { label: 'PACING', value: 'Kinetic Cut' },
      { label: 'OVERLAYS', value: 'UI Callouts' },
      { label: 'CONVERSION', value: 'Product Focus' }
    ]
  },
  {
    id: 'portrait-04',
    category: 'portrait-videos',
    categoryLabel: 'Portrait Videos',
    formatBadge: '9:16 PODCAST SHORT',
    title: 'Founder Story: Lessons From Bootstrapping',
    client: 'Executive Personal Brand',
    aspectRatio: '9/16',
    videoSrc: 'assets/videos/sample-reel.mp4',
    posterText: 'Founder Story & Lessons',
    description: 'Multi-cam dynamic cut with b-roll overlays, color pop, sound fx, and auto-synced subtitle animations for social feeds.',
    highlights: [
      { label: 'SOURCE', value: 'Longform Pod' },
      { label: 'DELIVERABLE', value: 'Multi-Cam Short' },
      { label: 'SOUND FX', value: 'Custom Layered' }
    ]
  },
  {
    id: 'portrait-05',
    category: 'portrait-videos',
    categoryLabel: 'Portrait Videos',
    formatBadge: '9:16 MOTION EDIT',
    title: 'Fitness Coaching Micro-Tutorial Routine',
    client: 'Wellness Brand Client',
    aspectRatio: '9/16',
    videoSrc: 'assets/videos/urban-reel.mp4',
    posterText: 'Fitness Micro-Tutorial',
    description: 'Fast-cut exercise guide with form callouts, dynamic tempo music sync, and branded lower-third motion graphics.',
    highlights: [
      { label: 'TEMPO', value: 'Music Beat Sync' },
      { label: 'GRAPHICS', value: 'Form Callouts' },
      { label: 'DEVICE', value: 'Mobile-First' }
    ]
  },

  /* ==========================================================================
     CATEGORY 2: LANDSCAPE VIDEOS (Horizontal 16:9)
     ========================================================================== */
  {
    id: 'landscape-01',
    category: 'landscape-videos',
    categoryLabel: 'Landscape Videos',
    formatBadge: '16:9 CAMPAIGN SUITE',
    title: 'Omnichannel Campaign Launch Suite',
    client: 'Lifestyle & Hospitality Group',
    aspectRatio: '16/9',
    videoSrc: 'assets/videos/landscape-sample.mp4',
    posterText: 'Omnichannel Launch Campaign',
    description: 'Synchronized visual campaign rollout spanning YouTube 16:9 brand films, social cutdowns, animated story teasers, and banners.',
    highlights: [
      { label: 'DELIVERABLES', value: '36 Assets' },
      { label: 'SPRINT TIME', value: '5-Day Turnaround' },
      { label: 'OVERHEAD', value: 'Zero In-House' }
    ]
  },
  {
    id: 'landscape-02',
    category: 'landscape-videos',
    categoryLabel: 'Landscape Videos',
    formatBadge: '16:9 BRAND FILM',
    title: 'Architectural Property Showcase & Stories',
    client: 'Luxury Real Estate Agency',
    aspectRatio: '16/9',
    videoSrc: 'assets/videos/brand-story.mp4',
    posterText: 'Architectural Property Showcase',
    description: 'High-end architectural walkthrough clips refined with custom LUT cinematic color grade, smooth pacing, and commercially licensed audio.',
    highlights: [
      { label: 'COLOR GRADE', value: 'Custom LUT' },
      { label: 'AUDIO', value: 'Commercially Licensed' },
      { label: 'STATUS', value: 'Retained Client' }
    ]
  },
  {
    id: 'landscape-03',
    category: 'landscape-videos',
    categoryLabel: 'Landscape Videos',
    formatBadge: '16:9 AD SUITE',
    title: 'Conversion-Engine Multi-Angle Ad Creative',
    client: 'Performance Ad Agency',
    aspectRatio: '16/9',
    videoSrc: 'assets/videos/landscape-sample.mp4',
    posterText: 'Direct-Response Ad Creative',
    description: 'Batch-edited UGC creative variations, product feature callouts, and motion overlays tested across video ad feeds.',
    highlights: [
      { label: 'HOOKS TESTED', value: '12 Angles' },
      { label: 'DELIVERY', value: '48h Batch Ship' },
      { label: 'OPTIMIZATION', value: 'Paid Ad Ready' }
    ]
  },
  {
    id: 'landscape-04',
    category: 'landscape-videos',
    categoryLabel: 'Landscape Videos',
    formatBadge: '16:9 EXPLAINER',
    title: 'The 7-Figure E-Commerce Scaling Framework',
    client: 'Growth Marketing Agency',
    aspectRatio: '16/9',
    videoSrc: 'assets/videos/brand-story.mp4',
    posterText: 'E-Commerce Growth Explainer',
    description: '10-slide visual framework broken down with custom isometric vector illustrations, typography hierarchy, and data animation.',
    highlights: [
      { label: 'FORMAT', value: '16:9 Explainer' },
      { label: 'ARTWORK', value: 'Custom Vectors' },
      { label: 'DELIVERY', value: '4K Master + Cutdowns' }
    ]
  },

  /* ==========================================================================
     CATEGORY 3: SEO RESULTS (Real Verified Screenshots & Metrics)
     ========================================================================== */
  {
    id: 'seo-01',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'LOCAL SEO / GOOGLE BUSINESS PROFILE',
    title: 'Palladium Janseva Hospital',
    primaryMetric: '700 Calls',
    primaryMetricLabel: 'CALLS FROM BUSINESS PROFILE',
    timeframe: 'Jun 2026 – Sept 2026',
    image: 'assets/images/seo-results/seo-result-palladium-700-calls.png',
    imageWebp: 'assets/images/seo-results/seo-result-palladium-700-calls.webp',
    description: 'Optimized Google Business Profile and local health citations to capture patient searches, climbing to 303 calls in August.',
    metrics: [
      { label: 'PEAK CALLS', value: '303 / Mo' },
      { label: 'TIMEFRAME', value: '4 Months' },
      { label: 'MAP PACK', value: 'Rank #1' }
    ]
  },
  {
    id: 'seo-02',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'SEO / ORGANIC VISIBILITY',
    title: 'A Leading Multispeciality Hospital',
    primaryMetric: '53K Active Users',
    primaryMetricLabel: 'LAST 30 DAYS PERFORMANCE',
    timeframe: 'October – November 2026',
    image: 'assets/images/seo-results/seo-result-hospital-53k-users.png',
    imageWebp: 'assets/images/seo-results/seo-result-hospital-53k-users.webp',
    description: 'Consistent organic search visibility driving continuous patient acquisition across multispeciality healthcare queries.',
    metrics: [
      { label: 'EVENTS', value: '331K (+2.2%)' },
      { label: 'KEY EVENTS', value: '108K (+0.9%)' },
      { label: 'NEW USERS', value: '52K (+5.6%)' }
    ]
  },
  {
    id: 'seo-03',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'SEO / ORGANIC DISCOVERY',
    title: 'A Leading Cruise Line',
    primaryMetric: '87K Active Users',
    primaryMetricLabel: 'ACTIVE USERS',
    timeframe: 'July – September 2026',
    image: 'assets/images/seo-results/seo-result-cruise-87k-users.png',
    imageWebp: 'assets/images/seo-results/seo-result-cruise-87k-users.webp',
    description: 'Organic discovery and passenger engagement across international travel queries and vacation destination searches.',
    metrics: [
      { label: 'NEW USERS', value: '84K' },
      { label: 'PEAK WEEKLY', value: '8,948 Users' },
      { label: 'TOP COUNTRIES', value: 'Saudi, UAE, US' }
    ]
  },
  {
    id: 'seo-04',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'LOCAL SEO / MAP PACK GROWTH',
    title: 'Local Search Growth',
    primaryMetric: '5,896',
    primaryMetricLabel: 'BUSINESS PROFILE INTERACTIONS',
    timeframe: 'April – September 2026',
    image: 'assets/images/seo-results/seo-result-local-interactions-5896.png',
    imageWebp: 'assets/images/seo-results/seo-result-local-interactions-5896.webp',
    description: 'Scaled local map pack visibility and customer engagement across high-intent localized search queries.',
    metrics: [
      { label: 'PEAK MONTH', value: '1,280+ Int' },
      { label: 'TIMEFRAME', value: '6 Months' },
      { label: 'SEARCH INTENT', value: 'Local Commercial' }
    ]
  },
  {
    id: 'seo-05',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'LOCAL SEO / HIGH-INTENT CALLS',
    title: 'Local Search Calls',
    primaryMetric: '224 Calls',
    primaryMetricLabel: 'CALLS FROM BUSINESS PROFILE',
    timeframe: 'July – September 2026',
    image: 'assets/images/seo-results/seo-result-local-calls-224.png',
    imageWebp: 'assets/images/seo-results/seo-result-local-calls-224.webp',
    description: 'High-urgency phone consultations and appointment calls made directly from Google Business Profile.',
    metrics: [
      { label: 'PEAK CALLS', value: '134 in August' },
      { label: 'INTENT', value: 'Direct Call-to-Action' },
      { label: 'GROWTH', value: '100% Increase' }
    ]
  },
  {
    id: 'seo-06',
    category: 'seo-results',
    categoryLabel: 'SEO Results',
    subCategory: 'LOCAL SEO / FOOT TRAFFIC',
    title: 'Local Search Discovery & Directions',
    primaryMetric: '1,443 Requests',
    primaryMetricLabel: 'DIRECTION REQUESTS',
    timeframe: 'Verified Profile Analytics',
    image: 'assets/images/seo-results/seo-result-local-directions-1443.png',
    imageWebp: 'assets/images/seo-results/seo-result-local-directions-1443.webp',
    description: 'Direction requests made from the Business Profile, guiding verified prospective customers straight to physical locations.',
    metrics: [
      { label: 'TOTAL REQUESTS', value: '1,443' },
      { label: 'TYPE', value: 'Turn-by-Turn GPS' },
      { label: 'INTENT', value: 'Physical Storefront' }
    ]
  },

  /* ==========================================================================
     CATEGORY 4: WEBSITES (Live Client Sites with Browser Mockups)
     ========================================================================== */
  {
    id: 'web-01',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'HEALTHCARE / WEB DEVELOPMENT',
    title: 'Palladium Janseva Hospital',
    domain: 'palladiumjanseva.com',
    url: 'https://palladiumjanseva.com/',
    screenshot: 'assets/images/websites/palladium.png',
    description: 'Multispeciality hospital web platform featuring emergency cathlab integrations, doctor directory, and SEO architecture.',
    highlights: ['WordPress / Custom Theme', 'SEO Foundations', 'Doctor Appointments']
  },
  {
    id: 'web-02',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'TOURISM & TRAVEL / DUBAI',
    title: 'Falcon Tourism',
    domain: 'falcontourism.ae',
    url: 'https://falcontourism.ae/en/',
    screenshot: 'assets/images/websites/falcon.png',
    description: 'High-end luxury travel, desert safari, and tourist package portal designed for seamless international inquiries and conversions.',
    highlights: ['Bilingual Interface', 'Tour Packages', 'Conversion Optimized']
  },
  {
    id: 'web-03',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'DIGITAL MEDIA / REAL ESTATE',
    title: 'A Real Estate Media',
    domain: 'arealestatemedia.com',
    url: 'https://arealestatemedia.com/',
    screenshot: 'assets/images/websites/arealestate.png',
    description: 'Media agency website showcasing high-end architectural cinematography, 3D virtual walkthroughs, and automated client booking.',
    highlights: ['Video Showcase', 'Media Portfolio', 'Instant Booking']
  },
  {
    id: 'web-04',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'E-COMMERCE / APPAREL',
    title: 'WearWulf',
    domain: 'wearwulf.in',
    url: 'https://wearwulf.in/',
    screenshot: 'assets/images/websites/wearwulf.png',
    description: 'Modern direct-to-consumer athletic apparel e-commerce store with high performance, clean cart flows, and mobile speed.',
    highlights: ['E-Commerce Store', 'Lightning Speed', 'Mobile-First UI']
  },
  {
    id: 'web-05',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'MEDICAL SPECIALTY / CLINIC',
    title: 'Acktiv Ortho',
    domain: 'acktivortho.com',
    url: 'https://acktivortho.com/',
    screenshot: 'assets/images/websites/acktivortho.png',
    description: 'Orthopedic clinic web presence built for local search discovery, patient clarity, and surgical consultation requests.',
    highlights: ['Medical Architecture', 'Local SEO Aligned', 'Consultation Flows']
  },
  {
    id: 'web-06',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'AGENCY PLATFORM / FULFILLMENT',
    title: 'CREWiiFY Platform',
    domain: 'crewiify.com',
    url: 'https://www.crewiify.com/',
    screenshot: 'assets/images/websites/crewiify.png',
    description: 'Full white-label fulfillment infrastructure, pricing calculators, partner rates, and client-facing digital showcase.',
    highlights: ['White-Label Engine', 'B2B Agency Rates', 'High-LCP Speed']
  },
  {
    id: 'web-07',
    category: 'websites',
    categoryLabel: 'Websites',
    subCategory: 'COMMUNITY & TRUST / HERITAGE',
    title: 'Cozmoh Shree Bhatiawadi Trust',
    domain: 'avxii-01.github.io',
    url: 'https://avxii-01.github.io/Cozmoh-Shree-Bhatiawadi-trust-/',
    screenshot: 'assets/images/websites/bhatiawadi.png',
    description: 'Community heritage trust portal featuring historical archives, institutional announcements, and donor services.',
    highlights: ['Heritage Archive', 'Public Notices', 'Responsive Portal']
  }
];

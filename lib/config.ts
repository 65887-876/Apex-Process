/**
 * ─────────────────────────────────────────────────────────────────────────
 * Apex Process — Central Site Configuration
 * ─────────────────────────────────────────────────────────────────────────
 * Single source of truth for brand, copy, form options, FAQ, documents,
 * videos, and legal disclaimers. Edit this file to re-skin the funnel.
 *
 * NOTE: All marketing copy below is ORIGINAL placeholder content for the
 * fictional "Apex Process" brand. Replace statistics, testimonials, and
 * legal language with verified, counsel-reviewed content before production.
 */

export const brand = {
  name: "Apex Process",
  shortName: "Apex",
  tagline: "Structured business onboarding, reviewed by people.",
  contactEmail: "hello@apexprocess.example.com",
  supportEmail: "support@apexprocess.example.com",
  // Used for metadata / Open Graph.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://apexprocess.example.com",
} as const;

export const cta = {
  primary: "Start Application",
  secondary: "See the Process",
  formStart: "Begin Eligibility Review",
} as const;

/**
 * Feature flags & honest, configurable claims.
 * Toggle these instead of hardcoding promises in copy.
 */
export const flags = {
  /** Show the "No upfront application fee" trust point. */
  noApplicationFee: true,
  /** Show the 48-hour review target. Keep honest — see reviewWindowHours. */
  showReviewWindow: true,
  /** Allow the form to route ineligible applicants to a waitlist state. */
  enableEligibilityGate: true,
} as const;

export const timeline = {
  /** Honest review-target window communicated to applicants. */
  reviewWindowHours: 48,
} as const;

/** ── Trust badges shown under the hero ─────────────────────────────────── */
export const trustBadges = [
  { label: "Encrypted application", icon: "shield" },
  { label: "No SSN on initial form", icon: "lock" },
  { label: "Documents requested after approval", icon: "fileCheck" },
  { label: "Attorney review recommended", icon: "scale" },
] as const;

/** ── "What You Get" value cards ────────────────────────────────────────── */
export const valueProps = [
  {
    title: "Structured onboarding",
    body: "A clear, stage-by-stage path from application to agreement — no guesswork, no black box.",
    icon: "route",
  },
  {
    title: "Secure document workflow",
    body: "Sensitive documents are only requested after an eligibility review, through an encrypted channel.",
    icon: "folderLock",
  },
  {
    title: "Clear review timeline",
    body: `Applications are reviewed against a published ${timeline.reviewWindowHours}-hour target so you always know where you stand.`,
    icon: "clock",
  },
  {
    title: "Professional agreement package",
    body: "Sample, plain-language agreement templates you can share with your own counsel before signing anything.",
    icon: "fileSignature",
  },
  {
    title: "Transparent reporting",
    body: "A status view that shows exactly which stage you're in and what's needed next.",
    icon: "lineChart",
  },
  {
    title: "Support team access",
    body: "Reach a real reviewer with questions about your application throughout the process.",
    icon: "headset",
  },
] as const;

/** ── "Why Apex" pillars ────────────────────────────────────────────────── */
export const whyApex = [
  {
    title: "Compliance-first by design",
    body: "Every step is built around documentation and consent — not pressure. We collect only what a stage actually requires.",
    icon: "shieldCheck",
  },
  {
    title: "Transparent at every stage",
    body: "You see the same status we do. No hidden steps, no surprise requirements late in the process.",
    icon: "eye",
  },
  {
    title: "Built for accountability",
    body: "Structured records mean a clean audit trail for you and for us — useful long after onboarding.",
    icon: "clipboardCheck",
  },
] as const;

/** ── Process timeline steps — six clear, neutral onboarding stages ─────── */
export const processSteps = [
  {
    title: "Apply",
    body: "Complete a short, secure application. No sensitive ID numbers required at this stage.",
  },
  {
    title: "Initial review",
    body: `Our team reviews eligibility against published criteria, typically within ${timeline.reviewWindowHours} hours.`,
  },
  {
    title: "Document request",
    body: "If eligible, we request supporting documents through an encrypted channel — only what's needed.",
  },
  {
    title: "Discovery call",
    body: "A scheduled call to walk through your situation, answer questions, and confirm fit.",
  },
  {
    title: "Agreement review",
    body: "Receive a plain-language agreement package to review with your own legal and tax advisors.",
  },
  {
    title: "Onboarding",
    body: "Once everything is signed and confirmed, we begin structured onboarding.",
  },
] as const;

/** ── Form option enums (kept in sync with lib/validation.ts) ───────────── */
export const formOptions = {
  states: [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
  ],
  contactMethods: ["Email", "Phone", "Text"],
  referralSources: [
    "Search engine",
    "Social media",
    "Referral from a friend",
    "Online advertisement",
    "Industry event",
    "Other",
  ],
  ageRanges: ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"],
  creditRanges: [
    "Below 580",
    "580–669",
    "670–739",
    "740–799",
    "800+",
    "Not sure",
  ],
  incomeRanges: [
    "Under $50k",
    "$50k–$99k",
    "$100k–$149k",
    "$150k–$249k",
    "$250k+",
    "Prefer not to say",
  ],
  experienceLevels: [
    "None yet",
    "Some experience",
    "Experienced",
    "Currently operating",
  ],
  callAvailability: [
    "Weekday mornings",
    "Weekday afternoons",
    "Weekday evenings",
    "Weekends",
    "Flexible",
  ],
  readiness: ["Yes, ready now", "Can get it soon", "Not yet"],
} as const;

/**
 * Configurable eligibility gate. When flags.enableEligibilityGate is on, the
 * wizard routes applicants whose answers fall entirely in these buckets to a
 * respectful waitlist state. Intentionally lenient and easy to tune.
 * TODO: align these with your real, lawful, non-discriminatory criteria.
 */
export const eligibilityRules = {
  // Treated as "not a fit right now" only when BOTH are true.
  waitlistIfCreditBelow580AndNoExperience: true,
} as const;

/** ── Discovery call dummy slots (replace with Calendly embed) ──────────── */
export const callSlots = [
  { id: "slot-1", label: "Tomorrow · 10:00 AM ET" },
  { id: "slot-2", label: "Tomorrow · 2:30 PM ET" },
  { id: "slot-3", label: "In 2 days · 11:15 AM ET" },
  { id: "slot-4", label: "In 2 days · 4:00 PM ET" },
  { id: "slot-5", label: "In 3 days · 9:30 AM ET" },
  { id: "slot-6", label: "In 3 days · 1:00 PM ET" },
] as const;

/** ── Documents (sample, counsel-review-required) ───────────────────────── */
export const documents = [
  {
    id: "program-overview",
    title: "Sample Program Overview",
    description:
      "A plain-language summary of how the Apex Process onboarding workflow is structured.",
    // TODO: replace with a real branded PDF placed in /public/pdfs
    file: "/pdfs/apex-sample-program-overview.pdf",
    pages: 2,
  },
  {
    id: "agreement-template",
    title: "Sample Agreement Template",
    description:
      "An illustrative agreement template with placeholder clauses — for discussion with your counsel only.",
    file: "/pdfs/apex-sample-agreement-template.pdf",
    pages: 3,
  },
  {
    id: "compliance-summary",
    title: "Sample Compliance & Disclosure Summary",
    description:
      "An overview of disclosures and applicant responsibilities, written in placeholder language.",
    file: "/pdfs/apex-sample-compliance-disclosure.pdf",
    pages: 2,
  },
] as const;

/** ── Client story videos (clearly-labeled placeholders) ─────────────────── */
export const videos = [
  {
    id: "video-1",
    name: "Client story (placeholder)",
    role: "Owner · Placeholder City, ST",
    duration: "1:42",
  },
  {
    id: "video-2",
    name: "Client story (placeholder)",
    role: "Founder · Placeholder City, ST",
    duration: "2:08",
  },
  {
    id: "video-3",
    name: "Client story (placeholder)",
    role: "Operator · Placeholder City, ST",
    duration: "1:25",
  },
] as const;

/** ── FAQ (compliant, cautious, original copy) ──────────────────────────── */
export const faq = [
  {
    q: "What is Apex Process?",
    a: "Apex Process is a structured application and onboarding workflow for qualified applicants. We organize the steps from initial application through document review, a discovery call, and an agreement review so the process is clear and well-documented.",
  },
  {
    q: "Is approval guaranteed?",
    a: "No. Submitting an application is not a guarantee of approval. Each application is reviewed against published eligibility criteria, and not every applicant will be a fit.",
  },
  {
    q: "Is income or any financial outcome guaranteed?",
    a: "No. We make no promise of income, compensation, partnership, or any financial result. Anyone promising guaranteed returns should be treated with caution.",
  },
  {
    q: "What documents are required?",
    a: "We only request supporting documents after an initial eligibility review. These may include a government ID, proof of address, and recent statements. We do not collect Social Security numbers on the initial application form.",
  },
  {
    q: "Is there an application fee?",
    a: flags.noApplicationFee
      ? "There is no upfront fee to submit an application. Any costs associated with a specific agreement, if applicable, would be disclosed in writing before you sign anything."
      : "Any applicable fees are disclosed in writing before you commit to anything.",
  },
  {
    q: "Can I have an attorney review the documents?",
    a: "Yes — we encourage it. Any sample documents we share are illustrative. We recommend you review any agreement with your own qualified legal and tax professionals before signing.",
  },
  {
    q: "How long does review take?",
    a: `We aim to complete an initial review within ${timeline.reviewWindowHours} hours of receiving a complete application. Complex situations may take longer, and we'll keep you informed.`,
  },
  {
    q: "How is my information protected?",
    a: "Applications are transmitted over encrypted connections, and we limit collection to what each stage requires. Sensitive documents are only requested through a secure channel after an eligibility review.",
  },
  {
    q: "Can I withdraw my application?",
    a: "Yes. You may withdraw your application at any time before signing an agreement by contacting our support team.",
  },
  {
    q: "Who should not apply?",
    a: "If you're looking for guaranteed income, a get-rich-quick opportunity, or are not prepared to provide accurate information and review documents carefully with your own advisors, this process is not the right fit.",
  },
] as const;

/** ── Social proof placeholders (process figures, not outcomes) ─────────── */
export const socialProof = {
  stats: [
    { value: `${timeline.reviewWindowHours}h`, label: "Initial review target", icon: "clock" },
    { value: "6", label: "Clearly defined stages", icon: "layers" },
    { value: "100%", label: "Document review before signing", icon: "fileCheck" },
    { value: "0", label: "SSNs collected at application", icon: "shield" },
  ],
  note: "Figures describe the process, not outcomes. Replace with verified data before launch.",
} as const;

/** ── Legal disclaimers ─────────────────────────────────────────────────── */
export const legal = {
  footerDisclaimer:
    "Apex Process provides a structured application and onboarding workflow for qualified applicants. Submitting an application does not guarantee approval, compensation, partnership, or any financial outcome. Any sample documents shown are for informational review only and are not legal, tax, financial, or investment advice. Applicants should consult qualified legal and tax professionals before signing any agreement.",
  documentDisclaimer:
    "SAMPLE DOCUMENT — These templates contain placeholder language for illustration only. They are not legal, tax, or financial advice and must be reviewed by qualified counsel before any use.",
  privacyNotice:
    "We collect this information solely to review your application. We do not collect Social Security numbers on this form. By submitting, you consent to our review of the information provided. See our Privacy Policy for details.",
  copyrightHolder: "Apex Process",
} as const;

export const nav = {
  links: [
    { label: "Why Apex", href: "#why" },
    { label: "Program", href: "#program" },
    { label: "Process", href: "#process" },
    { label: "Documents", href: "#documents" },
    { label: "FAQ", href: "#faq" },
  ],
  footerLinks: [
    { label: "Terms", href: "#terms" },
    { label: "Privacy", href: "#privacy" },
    { label: "Disclosure", href: "#disclosure" },
    { label: "Contact", href: "#apply" },
  ],
} as const;

export type SiteConfig = {
  brand: typeof brand;
  cta: typeof cta;
  flags: typeof flags;
};

export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  problem: string;
  role: string;
  approach: string;
  outcome: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  href?: string;
  status?: "live" | "archive" | "experiment";
};

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  summary: string;
};

export type ServiceTier = {
  name: string;
  description: string;
  items: { label: string; price: string }[];
  note?: string;
  available: boolean;
};

export type RoomContent = {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
};

export const site = {
  name: "Wei Hong Lo",
  apartmentLabel: "my Dunedin apartment",
  tagline: "I design and build tools for messy real-world problems.",
  location: "Relocating from Dunedin to Kuala Lumpur in January 2027",
  contact: {
    email: "hello@weihong.dev",
    linkedin: "https://linkedin.com/in/weihonglo",
    github: "https://github.com/lowhng",
  },
  meta: {
    title: "Wei Hong Lo — Come over",
    description:
      "A visit to my Dunedin apartment: consulting case studies, side projects, and research in mixed reality UX.",
    url: "https://demo.weihong.dev",
  },
  rooms: [
    {
      id: "hallway",
      title: "Come in",
      eyebrow: "Hallway",
      body: "I design and build tools for messy real-world problems.",
    },
    {
      id: "bathroom",
      title: "The model",
      eyebrow: "Bathroom",
      body: "A LiDAR-derived apartment model, translated into an interactive Three.js walkthrough.",
    },
    {
      id: "bedroom1",
      title: "Experience",
      eyebrow: "Bedroom 1",
      body: "Roles across utilities transformation, business analysis, UX, and AR research.",
    },
    {
      id: "bedroom2",
      title: "Research",
      eyebrow: "Bedroom 2",
      body: "PhD research in AR for on-site sports spectating, and AR headset widget placement.",
    },
    {
      id: "study",
      title: "Consulting",
      eyebrow: "Study",
      body: "Utilities-sector digital work for a New Zealand electricity distributor — anonymised case studies.",
    },
    {
      id: "living",
      title: "Side projects",
      eyebrow: "Living / Dining",
      body: "Things I ship on the side: products, internal tools, and AR experiments.",
    },
    {
      id: "kitchen",
      title: "Personal",
      eyebrow: "Kitchen",
      body: "Photography, cake decorating, and noodles — the warm corners of the week.",
    },
    {
      id: "storage",
      title: "Archive",
      eyebrow: "Storage",
      body: "Older projects and experiments kept on the shelf.",
    },
    {
      id: "contact",
      title: "Front door",
      eyebrow: "Contact",
      body: "Say hello — or leave a note on the way out.",
    },
  ] satisfies RoomContent[],
  experience: [
    {
      role: "Senior Consultant",
      org: "Mettle International",
      period: "Oct 2024 – present",
      summary:
        "Utilities sector digital transformation. Service Request Portal on Microsoft Power Platform, billing system migration, integrations.",
    },
    {
      role: "IT Business Analyst",
      org: "SPICAE",
      period: "Feb 2024 – Sep 2024",
      summary:
        "Asset management system rollout for an electricity distribution business.",
    },
    {
      role: "UX Consultant",
      org: "SPICAE",
      period: "Feb 2023 – Feb 2024",
      summary:
        "Power outage notifications: personas, journey maps, requirements.",
    },
    {
      role: "Research Assistant",
      org: "University of Otago",
      period: "Jul 2022 – Apr 2024",
      summary:
        "AR for on-site sports spectating (PhD) and AR headset widget placement.",
    },
  ] satisfies ExperienceItem[],
  caseStudies: [
    {
      id: "cs-1",
      title: "Service Request Portal",
      client: "a New Zealand electricity distributor",
      problem: "TODO: Describe the service-request problem space.",
      role: "TODO: Clarify my role on the engagement.",
      approach: "TODO: Outline the approach (Power Platform, integrations).",
      outcome: "TODO: Outcome without inventing metrics.",
    },
    {
      id: "cs-2",
      title: "Billing system migration",
      client: "a New Zealand electricity distributor",
      problem: "TODO: Describe the billing migration challenge.",
      role: "TODO: Clarify my role on the engagement.",
      approach: "TODO: Outline migration / integration approach.",
      outcome: "TODO: Outcome without inventing metrics.",
    },
    {
      id: "cs-3",
      title: "Power outage notifications",
      client: "a New Zealand electricity distributor",
      problem: "TODO: Describe notification / customer-comms problem.",
      role: "TODO: Clarify my UX consulting role.",
      approach: "TODO: Personas, journey maps, requirements approach.",
      outcome: "TODO: Outcome without inventing metrics.",
    },
  ] satisfies CaseStudy[],
  projects: [
    {
      id: "shareshare",
      title: "ShareShare",
      description:
        "AI receipt scanning and bill splitting PWA, built with Next.js.",
      href: "https://getshareshare.app",
      status: "live",
    },
    {
      id: "lidar",
      title: "LiDAR property models",
      description:
        "Phone scan to interactive 3D web model with views, cutaways, room labels and movable furniture.",
      status: "experiment",
    },
    {
      id: "ar",
      title: "AR experiments",
      description: "Hybrid AR, web AR, and PlayCanvas prototypes.",
      status: "experiment",
    },
    {
      id: "internal",
      title: "Internal tools",
      description: "XML analyser PWA, form digitiser, field mapper.",
      status: "experiment",
    },
  ] satisfies Project[],
  archive: [
    {
      id: "nzec",
      title: "NZ Electricity Calculator",
      description: "Archive — electricity plan comparison experiment.",
      href: "https://nzec.vercel.app",
      status: "archive",
    },
    {
      id: "physiomed",
      title: "PhysioMed Otago",
      description: "Archive — client website.",
      href: "https://physiomedotago.co.nz",
      status: "archive",
    },
  ] satisfies Project[],
  research: {
    phd: "PhD in HCI — AR for on-site sports spectating.",
    other: "AR headset widget placement research at the University of Otago.",
  },
  personal: [
    "Photography",
    "Cake decorating",
    "Noodles",
  ],
  services: [
    {
      name: "Website Development",
      description:
        "I build simple responsive websites and bring you along the journey. Fast turnaround time and affordable pricing.",
      available: true,
      items: [
        { label: "Basic Website (Single Page)", price: "1,299 NZD" },
        { label: "SEO Starter Pack", price: "199 NZD" },
        { label: "Multipage Website", price: "From 1,999 NZD" },
        { label: "Website Edits", price: "From 100 NZD" },
      ],
    },
    {
      name: "Consulting & Prototyping",
      description:
        "Strategic technology consulting and rapid prototyping services. Turn your ideas into actionable solutions.",
      available: false,
      note: "Not currently offered",
      items: [
        { label: "Tech Consultation", price: "120 NZD/hr" },
        { label: "UX Research & Analysis", price: "140 NZD/hr" },
        { label: "Rapid Prototyping", price: "160 NZD/hr" },
        { label: "Process Mapping", price: "160 NZD/hr" },
      ],
    },
  ] satisfies ServiceTier[],
} as const;

export const introLine = site.tagline;

// Single source of truth for all CV content (ADR-003).
//
// The frontpage (`/`) imports a subset of this object; the full CV (`/cv`)
// imports the whole. Edit content here only; no markup changes needed.
//
// IMPORTANT (ADR-002): this site exposes outbound profile links only. Do NOT
// add any direct contact detail of any kind. `PersonalDetails` is deliberately
// limited to dob / nationality / marital status, with no field for reaching the
// owner. The absence is structural so the rule cannot be broken by filling a
// blank. LinkedIn is the only contact route.

/** Complete content model for the CV. The only data model in the project. */
export interface CvData {
  /** Full name shown in the hero. */
  name: string;
  /** Current role/title eyebrow shown near the name. */
  title: string;
  /** One- to two-line hero positioning statement (the leading identity, ADR-002). */
  valueProp: string;
  /** 3-4 line professional summary, rendered on the full CV. */
  summary: string;
  /** Areas of expertise, scannable. */
  expertise: string[];
  /** Experience timeline, newest first. One array, rendered condensed or full. */
  roles: Role[];
  /** Short one-liners for early-career roles without dedicated bullets. */
  earlierRoles: string[];
  /** Selected quantified achievements; the metric leads visually. */
  impact: Highlight[];
  /** Degrees, newest first. */
  education: Education[];
  /** Certifications, networks, and associations. */
  certifications: string[];
  /** Publications and honours. */
  publications: string[];
  /** Outbound profile links (LinkedIn, GitHub, knowledge base). No contact details. */
  links: ProfileLink[];
  /** Personal details (Danish CV norm). Rendered on the full CV only. */
  personalDetails: PersonalDetails;
  /** Spare-time interests, rendered as a section on the full CV (task_03). */
  interests: Interest[];
  /** Optional leadership-approach narrative (Phase 2, task_09). */
  about?: string;
  /** Optional talks / writing references (Phase 2, task_09). */
  talks?: string[];
  /** Optional path to a downloadable resume under public/. Unused: the print-friendly /cv replaces a PDF (ADR-001). */
  resumePdf?: string;
}

// `themes` and `skills` are free-form string tags with no enforced enum
// (ADR-004), so the vocabulary can evolve without a type change. They are
// selection metadata (offline tailoring and the Phase 2 variants), not
// necessarily rendered in the MVP UI. Recommended starter themes for
// consistency (not validated), shared with the `work` schema in
// content.config.ts: ai-llm, platform-devex, org-scaling, cloud-realtime-data,
// security-compliance, transformation.

/** A single role in the experience timeline. */
export interface Role {
  company: string;
  /** Job title held at this company. */
  position: string;
  /** Start, e.g. "Jun 2023". */
  start: string;
  /** End or "Present". */
  end: string;
  /** One-line scope (used by the condensed frontpage view). */
  scope: string;
  /** Achievement bullets (used by the full /cv view). */
  bullets: string[];
  /** Free-form theme tags for selection (ADR-004). */
  themes?: string[];
  /** Free-form skill tags for selection (ADR-004). */
  skills?: string[];
}

/** A quantified impact highlight; the metric is shown first. */
export interface Highlight {
  /** The number, shown first, e.g. "3 → 20" or "500+". */
  metric: string;
  /** What the metric means. */
  summary: string;
  /** Free-form theme tags for selection (ADR-004). */
  themes?: string[];
}

/** A spare-time interest, tagged for selection. Growable list (ADR-004). */
export interface Interest {
  /** Short human label, e.g. "Golf, including Trackman simulator practice". */
  label: string;
  /** Free-form theme tags for selection (ADR-004). */
  themes?: string[];
}

/** A single education entry. */
export interface Education {
  /** Degree or qualification, e.g. "MSc, Computer Science & Engineering". */
  degree: string;
  /** Awarding institution. */
  institution: string;
  /** Start year, e.g. "2008". */
  start: string;
  /** End year, e.g. "2010". */
  end: string;
}

/** An outbound link to a professional profile. */
export interface ProfileLink {
  /** Display label, e.g. "LinkedIn". */
  label: string;
  /** Absolute URL of the profile. */
  url: string;
}

/**
 * Personal details per Danish CV norms. Intentionally has no field for
 * contacting the owner in any way (ADR-002).
 */
export interface PersonalDetails {
  /** Date of birth. */
  dob: string;
  /** Nationality. */
  nationality: string;
  /** Marital status. */
  maritalStatus: string;
}

// ─── CONTENT ─────────────────────────────────────────────────────────────────
// Sourced from docs/Content/_base/master-CV.md (and about-me.md / the leadership
// narrative for the summary and value proposition). Real figures only.
export const cvData: CvData = {
  name: "Jon Østerby Carlsen",
  title: "Director of Engineering & AI · AXON Networks",
  valueProp:
    "I build engineering organisations that turn high-volume, real-time data into intelligent products, and give teams the platforms to ship on their own. Around 20 years across Europe and Asia, now leading engineering and AI at AXON, where LLM-driven agents act on telemetry arriving at up to 50,000 datapoints per second per device.",
  summary:
    "Engineering leader with around 20 years in tech, currently Director of Engineering and AI for EMEA at AXON Networks, where I lead the organisation behind a cloud-native platform that turns network telemetry into operational insight at up to 50,000 datapoints per second per device, and built the AI/ML team that puts LLM-driven agents on those live streams. Earlier, at DFDS, I grew the developer-platform department from 3 to 20 and drove a company-wide move to cloud-native that reached around 200 engineers and 500+ microservices on Kubernetes, built from zero in three years. Before that I led roughly 50-person organisations at Scrive and Lunar and built distributed teams across Europe and Asia. The through-line is simple: I tend to leave an organisation a maturity stage further along than I found it.",
  expertise: [
    "Engineering leadership and organisational scaling",
    "AI/ML, GenAI, LLM and local-LLM product integration",
    "Cloud and real-time data architecture",
    "High-performance computing and microservices",
    "Product and technology strategy",
    "DevOps, SRE and platform engineering",
    "Cross-functional leadership, agile coaching and team development",
  ],
  roles: [
    {
      company: "AXON Networks",
      position: "Director of Engineering & AI (EMEA)",
      start: "Jun 2023",
      end: "Present",
      scope:
        "Lead the AXON Orchestrator organisation in EMEA, around 40 people, plus supporting integration of 70 across Europe.",
      bullets: [
        "Lead the engineering and AI organisation behind a cloud-native platform that turns network telemetry into operational insight at up to 50,000 datapoints per second per device.",
        "Defined the target cloud architecture and built a new AI/ML team for LLM-driven agents that act on live telemetry rather than on stale snapshots.",
        "Scaled the real-time data pipelines so AI and LLM models read high-frequency streams directly.",
        "Led the move from Java to Go for the services that needed predictable performance.",
        "Set up a continuous-delivery culture with clear ownership, so teams ship without waiting on a central bottleneck.",
        "Led the integration of the ACS system into the platform and kept one architecture coherent through post-acquisition integration.",
      ],
      themes: [
        "ai-llm",
        "cloud-realtime-data",
        "org-scaling",
        "platform-devex",
        "transformation",
      ],
      skills: [
        "ai-ml",
        "real-time-data",
        "cloud-architecture",
        "go",
        "engineering-leadership",
      ],
    },
    {
      company: "Heeplink",
      position: "Advisory Board Member",
      start: "Dec 2022",
      end: "Apr 2024",
      scope:
        "Advisory role for a digital platform matching skilled people with the projects that need them.",
      bullets: [
        "Advised on technology direction and product strategy for the matching platform.",
      ],
      themes: ["product-strategy", "transformation"],
      skills: ["advisory", "product-strategy", "technology-strategy"],
    },
    {
      company: "Lunar A/S",
      position: "Director of Technology, Developer & Platform Experience",
      start: "Aug 2022",
      end: "Feb 2023",
      scope: "Around 50 people across 5 teams.",
      bullets: [
        "Created the developer-and-platform department from scratch, defining its roles and reporting lines.",
        "Enabled self-service and x-as-a-service for developers, data engineers, security, and the wider business.",
        "Built an investor pitch deck setting out the value proposition and growth potential.",
        "Ran the department on outcome targets, including eID consolidation and platform robustness, while holding continuous regulatory compliance.",
      ],
      themes: ["platform-devex", "org-scaling", "security-compliance"],
      skills: [
        "platform-engineering",
        "self-service",
        "engineering-leadership",
        "regulatory-compliance",
      ],
    },
    {
      company: "Scrive",
      position: "VP of Service Operations & CTO of eSignatur",
      start: "Oct 2021",
      end: "Aug 2022",
      scope:
        "Around 50 people across 5 teams within a 200+ person, Vitruvian-backed business.",
      bullets: [
        "Improved service SLA and reduced operational cost through a move to containers and Kubernetes with zero downtime.",
        "Led preparation and a successful audit for ISO 27001 and ISAE 3000 certifications.",
        "Converted team leads into managers through coaching and mentorship.",
        "Strengthened the incident-response process via a cross-functional improvement team.",
      ],
      themes: ["security-compliance", "transformation", "org-scaling"],
      skills: [
        "kubernetes",
        "service-operations",
        "iso-27001",
        "engineering-leadership",
      ],
    },
    {
      company: "eSignatur",
      position: "Chief Technology Officer",
      start: "Apr 2021",
      end: "Oct 2021",
      scope:
        "Led a Danish e-signature company across development, QA, support, security, and compliance.",
      bullets: [
        "Devised a cloud-adoption plan using a cloud-native maturity matrix.",
        "Managed and onboarded sourcing partners, covering vendor selection, contracts, and SLAs.",
        "Improved collaboration and productivity by leading Agile adoption.",
        "Owned the product and technical roadmap and supported customer sales meetings.",
      ],
      themes: ["transformation", "platform-devex", "security-compliance"],
      skills: [
        "cloud-architecture",
        "vendor-management",
        "agile",
        "product-strategy",
      ],
    },
    {
      company: "DFDS",
      position: "Head of Department, Developer & Platform Experience",
      start: "Nov 2017",
      end: "Mar 2021",
      scope: "Scaled the core department from 3 to 20 people over three years.",
      bullets: [
        "Drove cloud-native microservices adoption across the business, enabling around 200 engineers to build for the cloud.",
        "Operated 500+ microservices in Kubernetes within three years, starting from zero.",
        "Built an internal developer platform with self-service and golden paths (Team Topologies, Platform as Product).",
        "Selected for the DFDS Horizon management talent programme, out of 200 nominees.",
      ],
      themes: ["platform-devex", "org-scaling", "transformation"],
      skills: [
        "kubernetes",
        "microservices",
        "platform-engineering",
        "engineering-leadership",
      ],
    },
    {
      company: "DFDS",
      position: "Head of Department, Customer Experience (CMS & Booking)",
      start: "Nov 2014",
      end: "Oct 2017",
      scope: "Scaled the department from 2 to 5 teams.",
      bullets: [
        "Transformed the architecture to React, serverless, and a headless CMS, and released DFDS's first responsive website.",
        "Implemented A/B and multivariate testing across the web teams.",
        "Integrated design and UX into the teams and shipped on continuous delivery with infrastructure as code.",
        "Led the \"DFDS Way\" of working and rolled out the development mission via roadshows.",
      ],
      themes: ["transformation", "platform-devex", "org-scaling"],
      skills: [
        "react",
        "serverless",
        "continuous-delivery",
        "engineering-leadership",
      ],
    },
    {
      company: "Ørsted (formerly DONG Energy)",
      position: "Product Owner / Software Developer & Architect",
      start: "Jun 2007",
      end: "Oct 2014",
      scope:
        "Led Agile/SCRUM transformation and built distributed development teams in Asia.",
      bullets: [
        "Started and trained multiple offshore teams in Asia and established the development centre.",
        "Designed SOA and event-driven integrations, and delivered SMS gateways, monitoring, and a Virtual Power Plant (PowerHub).",
        "Implemented SCRUM organisation-wide and created a Story Points estimation model.",
        "Developed the technical tender specification for a new Distribution Management System to enable smart grid.",
      ],
      themes: ["transformation", "org-scaling", "cloud-realtime-data"],
      skills: [
        "soa",
        "event-driven-architecture",
        "scrum",
        "software-architecture",
      ],
    },
  ],
  earlierRoles: [
    "DONG Energy, Master Thesis (DTU): External Short Messaging Entity, SMS-gateway prototype, 2009 to 2010.",
    "Microsoft, Student Partner, evangelism of Microsoft technologies at Danish universities, 2005 to 2007.",
    "Ministry of the Environment, Denmark, IT Support, 2005 to 2007.",
    "Polyteknisk Forenings Studentersociale Fond, Board Member and Vice-Chairman, 2005 to 2006.",
  ],
  impact: [
    {
      metric: "50,000/s",
      summary:
        "Datapoints per second per device processed by the real-time AXON platform I lead.",
      themes: ["cloud-realtime-data", "ai-llm"],
    },
    {
      metric: "3 → 20",
      summary:
        "Scaled the DFDS Developer & Platform Experience department over three years.",
      themes: ["org-scaling", "platform-devex"],
    },
    {
      metric: "500+",
      summary:
        "Microservices run on Kubernetes at DFDS, built from zero in three years.",
      themes: ["platform-devex", "transformation"],
    },
    {
      metric: "~200",
      summary:
        "Engineers moved to cloud-native microservices in a business-wide DFDS transformation.",
      themes: ["transformation", "org-scaling"],
    },
    {
      metric: "ISO 27001",
      summary:
        "and ISAE 3000 certifications taken through successful audit at Scrive.",
      themes: ["security-compliance"],
    },
  ],
  education: [
    {
      degree: "MSc, Computer Science & Engineering",
      institution: "Technical University of Denmark (DTU)",
      start: "2008",
      end: "2010",
    },
    {
      degree: "HD, Business Administration & Management",
      institution: "Copenhagen Business School",
      start: "2012",
      end: "2014",
    },
    {
      degree: "BEng, Information Technology",
      institution: "Technical University of Denmark (DTU)",
      start: "2003",
      end: "2008",
    },
    {
      degree: "High School (Mathematics)",
      institution: "Øregård Gymnasium",
      start: "1999",
      end: "2002",
    },
  ],
  certifications: [
    "Advisory Board Member, Heeplink (2022 to 2024)",
    "NOVA Talent Network (2011 to Present)",
    "Scalers CTO/CPO Network (2021 to Present)",
    "DFDS Horizon Talent Programme, selected participant",
    "Management 3.0 (2015)",
    "Certified SCRUM Product Owner (CSPO)",
    "Certified ScrumMaster (CSM)",
    "IT Architecture Foundation, Danish IT (DIT)",
  ],
  publications: [
    "Master Thesis (DTU): External Short Messaging Entity",
    "Microsoft TechEd, Barcelona",
    "SmartGrid & E-mobility OTTI 2010",
    "CIM User Group 2010",
    "Telvent User Group, Denver 2012",
  ],
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/joncarlsen/" },
    { label: "GitHub", url: "https://github.com/carlsendk" },
    {
      label: "Knowledge Base",
      url: "https://carlsendk.github.io/tech-leadership/",
    },
  ],
  personalDetails: {
    dob: "4 September 1982",
    nationality: "Danish",
    maritalStatus: "Married",
  },
  interests: [
    {
      label: "Golf, including Trackman simulator practice through the winter",
      themes: ["sport", "data-curiosity"],
    },
    {
      label: "Soccer, playing and following the game",
      themes: ["sport", "team"],
    },
    {
      label: "NFL and flag football",
      themes: ["sport", "team"],
    },
    {
      label: "Home automation and hobby coding",
      themes: ["tech", "hands-on-engineering"],
    },
    {
      label: "Running",
      themes: ["sport", "endurance"],
    },
    {
      label: "Coaching and mentoring, on and off the field",
      themes: ["leadership", "mentoring"],
    },
    {
      label: "Family time and the outdoors",
      themes: ["family", "outdoors"],
    },
  ],
};

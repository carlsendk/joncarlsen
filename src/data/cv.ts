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
  /** Hard executive scope line: org size, transformation reach, remit owned. One complete sentence, no draft markers (ADR-003). */
  scope: string;
  /** Curated executive signals (CTO remit, board, scaling, recognition). Rendered through the isReady guard (task_03). */
  credentials: string[];
  /** Areas of expertise, scannable. */
  expertise: string[];
  /** Experience timeline, newest first. One array, rendered condensed or full. */
  roles: Role[];
  /** Short one-liners for early-career roles without dedicated bullets. */
  earlierRoles: string[];
  /** Degrees, newest first. */
  education: Education[];
  /** Certifications, networks, and associations. */
  certifications: string[];
  /** Publications and honours, each optionally linking to a backing work case study. */
  publications: Publication[];
  /** Outbound profile links (LinkedIn, GitHub, knowledge base). No contact details. */
  links: ProfileLink[];
  /** Personal details (Danish CV norm). Rendered on the full CV only. */
  personalDetails: PersonalDetails;
  /** Spare-time interests, rendered as a section on the full CV (task_03). */
  interests: Interest[];
  /** Voluntary leadership and community roles, rendered on the full CV. */
  voluntaryLeadership: VoluntaryRole[];
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

/**
 * A role bullet: a description of work done, optionally linking to the work
 * case study that backs it (ADR-003). The bullet carries no metric — impact
 * lives on the work entry's `metrics[]`.
 */
export interface Bullet {
  /** Description of work done, rendered on /cv. */
  text: string;
  /** Work-collection slug (the file id under src/content/work/) when a case study backs the bullet. */
  work?: string;
}

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
  /** Achievement bullets, each a description with an optional work link (used by the full /cv view). */
  bullets: Bullet[];
  /** Free-form theme tags for selection (ADR-004). */
  themes?: string[];
  /** Free-form skill tags for selection (ADR-004). */
  skills?: string[];
}

/** A spare-time interest, tagged for selection. Growable list (ADR-004). */
export interface Interest {
  /** Short human label, e.g. "Golf, including Trackman simulator practice". */
  label: string;
  /** Free-form theme tags for selection (ADR-004). */
  themes?: string[];
}

/** A voluntary leadership role: sustained people-development outside paid work. */
export interface VoluntaryRole {
  /** Role and organisation, e.g. "Sea Scout Leader, Det Danske Spejderkorps". */
  role: string;
  /** One-line description of the work. */
  detail: string;
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
  /** Optional study-era activities alongside the degree (student governance, tutoring). */
  activities?: string[];
}

/** A publication or honour, optionally linking to a backing work case study. */
export interface Publication {
  /** Display label. */
  label: string;
  /** Work-collection slug (file id under src/content/work/) when a case study backs it. */
  work?: string;
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

// ─── RENDER GUARD (ADR-003) ──────────────────────────────────────────────────
// Draft figures are staged inline in array items using the sentinel `[TODO: ...]`
// (for example "Reduced cloud spend by [TODO: % YoY] at Scrive"). Array-rendering
// components filter items through `isReady` so unfinished drafts never reach the
// page. Single-string spine fields (summary, scope) hold complete sentences only.

/** Sentinel that marks a draft figure not yet ready to render. */
export const TODO_SENTINEL = "[TODO";

/** True when the text holds no draft sentinel and is safe to render. */
export function isReady(text: string): boolean {
  return !text.includes(TODO_SENTINEL);
}

// ─── CONTENT ─────────────────────────────────────────────────────────────────
// Sourced from docs/Content/_base/master-CV.md (and about-me.md / the leadership
// narrative for the summary and value proposition). Real figures only.
export const cvData: CvData = {
  name: "Jon Østerby Carlsen",
  title: "Director of Engineering & AI · AXON Networks",
  valueProp:
    "Technology executive who turns high-volume, real-time data into intelligent products, and turns engineering teams into platforms that ship on their own. Around 20 years scaling organisations across Europe and Asia, now leading engineering and AI at AXON, where LLM-driven agents act on telemetry arriving at up to 50,000 datapoints per second per device.",
  summary:
    "Technology executive with around 20 years in tech, now Director of Engineering and AI for EMEA at AXON Networks, where I own the organisation behind a cloud-native platform that turns network telemetry into operational insight at up to 50,000 datapoints per second per device, and built the AI/ML team that puts LLM-driven agents on those live streams. At DFDS I grew the developer-platform department from 3 to 20 and drove a business-wide move to cloud-native that reached around 200 engineers and 500+ microservices on Kubernetes, built from zero in three years. Before that I held executive ownership of roughly 50-person organisations as VP at Scrive and CTO at eSignatur, and as Director at Lunar, and built distributed teams across Europe and Asia. The through-line is simple: I tend to leave an organisation a maturity stage further along than I found it.",
  scope:
    "Executive engineering leadership over focused 40 to 50 person organisations and a business-wide cloud-native transformation that reached around 200 engineers, with full remit over technology direction, AI strategy, security, and compliance.",
  credentials: [
    "Owned the full CTO remit at eSignatur: product and technical roadmap, security, compliance, cloud strategy, and vendor management.",
    "Built the AI function and target cloud architecture at AXON, putting LLM-driven agents on live telemetry.",
    "VP of Service Operations and CTO of eSignatur inside a 200+ person, Vitruvian-backed business at Scrive.",
    "Created and ran around 50-person engineering organisations at Scrive and Lunar.",
    "Built the investor pitch deck at Lunar, setting out the value proposition and growth potential.",
    "Advisory Board Member at Heeplink, 2022 to 2024.",
    "Member of the Scalers CTO/CPO network since 2021.",
    "Reported technology strategy and risk to the board and investors on a [TODO: board/investor cadence] basis.",
    "Scaled the DFDS developer and platform department from 3 to 20 and drove a 200-engineer move to cloud-native microservices.",
    "Selected for the DFDS Horizon management talent programme, out of 200 nominees.",
    "Author of a public framework on engineering leadership and platform operating models.",
    "HD in Business Administration and Management (CBS), backing the commercial side of technology leadership.",
  ],
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
        {
          text: "Own the engineering and AI organisation behind a cloud-native platform that turns network telemetry into operational insight at up to 50,000 datapoints per second per device.",
          work: "axon-ai-platform",
        },
        {
          text: "Defined the target cloud architecture and built a new AI/ML team for LLM-driven agents that act on live telemetry rather than on stale snapshots.",
          work: "axon-ai-platform",
        },
        {
          text: "Scaled the real-time data pipelines so AI and LLM models read high-frequency streams directly.",
          work: "axon-ai-platform",
        },
        {
          text: "Led the move from Java to Go for the services that needed predictable performance.",
          work: "axon-ai-platform",
        },
        {
          text: "Set up a continuous-delivery culture with clear ownership, so teams ship without waiting on a central bottleneck.",
          work: "axon-ai-platform",
        },
        {
          text: "Led the integration of the ACS system into the platform and kept one architecture coherent through post-acquisition integration.",
          work: "axon-ai-platform",
        },
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
        {
          text: "Advised on technology direction and product strategy for the matching platform.",
        },
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
        {
          text: "Created the developer-and-platform department from scratch, defining its roles and reporting lines.",
          work: "lunar-platform-experience",
        },
        {
          text: "Enabled self-service and x-as-a-service for developers, data engineers, security, and the wider business.",
          work: "lunar-platform-experience",
        },
        {
          text: "Built an investor pitch deck setting out the value proposition and growth potential.",
          work: "lunar-platform-experience",
        },
        {
          text: "Ran the department on outcome targets, including eID consolidation and platform robustness, while holding continuous regulatory compliance.",
          work: "lunar-eid-consolidation",
        },
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
        {
          text: "Improved service SLA and reduced operational cost through a move to containers and Kubernetes with zero downtime.",
          work: "scrive-kubernetes-iso27001",
        },
        {
          text: "Lifted service SLA to [TODO: SLA % after] and cut operational cost by [TODO: cost reduction %] through the zero-downtime move to containers and Kubernetes.",
          work: "scrive-kubernetes-iso27001",
        },
        {
          text: "Led preparation and a successful audit for ISO 27001 and ISAE 3000 certifications.",
          work: "scrive-kubernetes-iso27001",
        },
        {
          text: "Converted team leads into managers through coaching and mentorship.",
          work: "scrive-kubernetes-iso27001",
        },
        {
          text: "Strengthened the incident-response process via a cross-functional improvement team.",
          work: "scrive-kubernetes-iso27001",
        },
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
        {
          text: "Devised a cloud-adoption plan using a cloud-native maturity matrix.",
        },
        {
          text: "Managed and onboarded sourcing partners, covering vendor selection, contracts, and SLAs.",
        },
        {
          text: "Improved collaboration and productivity by leading Agile adoption.",
        },
        {
          text: "Owned the product and technical roadmap and supported customer sales meetings.",
        },
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
        {
          text: "Drove cloud-native microservices adoption across the business, enabling around 200 engineers to build for the cloud.",
          work: "dfds-platform",
        },
        {
          text: "Operated 500+ microservices in Kubernetes within three years, starting from zero.",
          work: "dfds-platform",
        },
        {
          text: "Built an internal developer platform with self-service and golden paths (Team Topologies, Platform as Product).",
          work: "dfds-platform",
        },
        {
          text: "Selected for the DFDS Horizon management talent programme, out of 200 nominees.",
          work: "dfds-platform",
        },
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
      scope: "Scaled the customer-experience department from 5 to 25 people across 5 teams.",
      bullets: [
        {
          text: "Transformed the architecture to React, serverless, and a headless CMS, and released DFDS's first responsive website.",
          work: "dfds-responsive-web-platform",
        },
        {
          text: "Implemented A/B and multivariate testing across the web teams.",
          work: "dfds-responsive-web-platform",
        },
        {
          text: "Integrated design and UX into the teams and shipped on continuous delivery with infrastructure as code.",
          work: "dfds-responsive-web-platform",
        },
        {
          text: "Led the \"DFDS Way\" of working and rolled out the development mission via roadshows.",
          work: "dfds-way-of-working",
        },
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
      position: "Product Owner, SCRUM Master & IT Architect",
      start: "May 2010",
      end: "Oct 2014",
      scope:
        "Product owner and technical lead across the energy IT estate, running SCRUM with distributed teams in Denmark and a 100-person offshore development centre in Asia, and setting architecture as the business modernised.",
      bullets: [
        {
          text: "Designed event-driven integrations and helped deliver PowerHub, a real-time Virtual Power Plant that monitors around 20 distributed energy assets and runs them as one.",
          work: "orsted-virtual-power-plant",
        },
        {
          text: "Wrote the technical tender specification for a new smart-grid Distribution Management System.",
          work: "orsted-distribution-management-system",
        },
        {
          text: "Led a five-person team as team lead and SCRUM Master, running the SMS messaging platform that handles millions of SMS a year to Ørsted's units and customers, and migrating the gateway with a zero-downtime production cutover.",
          work: "orsted-sms-messaging-platform",
        },
        {
          text: "Owned delivery of GIS and digital web platforms on ESRI as product owner, with distributed teams in Denmark and Malaysia on TFS, test-driven development, and continuous integration, delivering the projects on time and under budget.",
          work: "orsted-gis-digital-platform",
        },
        {
          text: "Implemented SCRUM across around 20 teams, created a Story Points estimation model, and coached the teams, SCRUM Masters, and new product owners through the change.",
          work: "orsted-agile-scrum-transformation",
        },
        {
          text: "Put a heavy focus on engineering practices throughout, building good CI and CD into every product so continuous delivery was the default.",
        },
      ],
      themes: ["transformation", "org-scaling", "cloud-realtime-data"],
      skills: [
        "soa",
        "event-driven-architecture",
        "scrum",
        "software-architecture",
      ],
    },
    {
      company: "Ørsted (formerly DONG Energy)",
      position: "Software Developer & Project Manager",
      start: "Feb 2008",
      end: "May 2010",
      scope:
        "Built a new SMS gateway part-time while studying for my master's, using an IT project model and early agile practices.",
      bullets: [
        {
          text: "Delivered a new SMS gateway in C#, WCF, Oracle, and MSMQ, the subject of my master thesis and run as a project I managed with a steering group.",
          work: "dong-master-thesis-sms",
        },
        {
          text: "Introduced agile practices to the delivery, an early step toward the SCRUM transformation that followed.",
          work: "orsted-agile-scrum-transformation",
        },
      ],
      themes: ["transformation", "cloud-realtime-data"],
      skills: ["c-sharp", "wcf", "oracle", "agile"],
    },
    {
      company: "Ørsted (formerly DONG Energy)",
      position: "Software Development Intern",
      start: "Jun 2007",
      end: "Feb 2008",
      scope:
        "Worked on automated metering over SMS as part of my bachelor studies.",
      bullets: [
        {
          text: "Supported development on Oracle and .NET for automated metering by SMS communication.",
          work: "dong-bachelor-sms-monitoring",
        },
        {
          text: "Built my bachelor project: an application to monitor SMS communication at the company in C#, ASP.NET, and Oracle, improving visibility into breaks in internal communication.",
          work: "dong-bachelor-sms-monitoring",
        },
      ],
      themes: ["cloud-realtime-data"],
      skills: ["c-sharp", "dotnet", "oracle"],
    },
  ],
  earlierRoles: [
    "Ministry of the Environment, Denmark, IT Support: first-line support to ITIL standards, aligning IT services with business needs, 2005 to 2007.",
  ],
  education: [
    {
      degree: "MSc, Computer Science & Engineering",
      institution: "Technical University of Denmark (DTU)",
      start: "2008",
      end: "2010",
      activities: [
        "Focused on efficient software and hardware solutions for complex technical problems, covering systems analysis, modelling, and implementation.",
        "Notable courses: Windows Programming in C# and .NET, and Advanced Databases.",
        "Master thesis with DONG Energy: External Short Messaging Entity, an SMS gateway.",
      ],
    },
    {
      degree: "HD, Business Administration & Management",
      institution: "Copenhagen Business School",
      start: "2012",
      end: "2014",
      activities: [
        "A part-time diploma in two parts: a general Graduate Certificate in business administration, then a specialised Graduate Diploma.",
        "Studied two evenings a week for the commercial grounding behind technology leadership.",
      ],
    },
    {
      degree: "BEng, Information Technology",
      institution: "Technical University of Denmark (DTU)",
      start: "2003",
      end: "2008",
      activities: [
        "Focused on complex digital systems.",
        "Bachelor project with DONG Energy: an application to monitor SMS communication.",
      ],
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
    "Nova Pro Talent Network (2011 to Present)",
    "Scalers CTO/CPO Network (2021 to Present)",
    "DFDS Horizon Talent Programme, selected participant",
    "Management 3.0 (2015)",
    "Certified SCRUM Product Owner (CSPO)",
    "Certified ScrumMaster (CSM)",
    "IT Architecture Foundation, Danish IT (DIT)",
  ],
  publications: [
    { label: "Invited graduation speaker, DTU, 2024" },
    {
      label: "Master thesis (DTU): External Short Messaging Entity",
      work: "dong-master-thesis-sms",
    },
    {
      label: "Bachelor project (DTU): SMS Communication Monitoring",
      work: "dong-bachelor-sms-monitoring",
    },
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
      label: "Family time and the outdoors",
      themes: ["family", "outdoors"],
    },
  ],
  voluntaryLeadership: [
    {
      role: "Sea Scout Leader, Det Danske Spejderkorps",
      detail:
        "A lifelong sea scout. I teach children and young people seamanship, sailing, and scouting, and develop them into young leaders. This has run alongside my whole career and shaped how I coach and grow people.",
      themes: ["leadership", "mentoring"],
    },
    {
      role: "Instructor, PLAN leadership courses (Det Danske Spejderkorps)",
      detail:
        "Lead national leadership courses for 12 to 16 year-olds, with a focus on sailing, helping young people grow into stronger leaders.",
      themes: ["leadership", "mentoring"],
    },
    {
      role: "Blå Sommer 2009, national scout camp",
      detail:
        "Co-created a sailing activity and coded an SMS game for scouts to play. Around 400 scouts came through our activity each day over five days.",
      themes: ["leadership", "hands-on-engineering"],
    },
    {
      role: "SØ-landslejr, sea scout national camp",
      detail: "Helped organise the camp and run activities for participants.",
      themes: ["leadership"],
    },
    {
      role: "Football coach",
      detail: "Coached children and young people in soccer.",
      themes: ["leadership", "mentoring"],
    },
    {
      role: "Vice-Chairman, Polyteknisk Forening (DTU student organisation)",
      detail:
        "Led internal management, board communication, and strategy implementation for the student organisation at DTU.",
      themes: ["leadership"],
    },
    {
      role: "Student tutor, DTU",
      detail: "Tutored first-year students.",
      themes: ["leadership", "mentoring"],
    },
  ],
  about:
    "I lead with a clear purpose, create room for people to master their craft, and build organisations that can act on their own through autonomy and delegation. I start from the business strategy and work back to the technology roadmap, so the engineering bets line up with where the company is going. Most of what I build is there to make good outcomes repeatable rather than heroic: self-service platforms, and measurement tied to real business results instead of activity. I meet an organisation at the maturity stage it is actually at and move it forward one deliberate step at a time, toward automation and AI-driven operations. That is the work at AXON now, taking a modern engineering culture into LLM-driven agents that act on live telemetry.",
  talks: [
    "Engineering operating model, a framework for aligning technology direction with business strategy. https://carlsendk.github.io/tech-leadership/wiki/operating-model/operating-model-framework",
    "Engineering practices, a maturity model from normalisation to self-service platforms. https://carlsendk.github.io/tech-leadership/wiki/engineering-practices",
    "Engineering effectiveness, optimising the inputs that let teams do their best work. https://carlsendk.github.io/tech-leadership/wiki/engineering-effectiveness",
  ],
};

// Single source of truth for all CV content (ADR-003).
//
// To update the site, edit the `cvData` object below — no markup changes needed.
//
// IMPORTANT (ADR-002): do NOT add an email address, phone number, or any other
// direct contact detail here. Outbound profile links only.

/** Complete content model for the CV page. The only data model in the project. */
export interface CvData {
  /** Full name shown in the hero. */
  name: string;
  /** Current role/title shown under the name. */
  title: string;
  /** One-line hero positioning statement. */
  valueProp: string;
  /** Experience timeline, newest first. */
  roles: Role[];
  /** Selected quantified achievements. */
  impact: Highlight[];
  /** Outbound profile links (GitHub, LinkedIn, other). */
  links: ProfileLink[];
  /** Path to a downloadable resume under public/, e.g. "/resume.pdf". Omit to hide the download. */
  resumePdf?: string;
}

/** A single role in the experience timeline. */
export interface Role {
  company: string;
  /** Job title held at this company. */
  position: string;
  /** Start year, e.g. "2021". */
  start: string;
  /** End year or "Present". */
  end: string;
  /** Team/org scope, e.g. "Led 30 across 4 teams". */
  scope: string;
}

/** A quantified impact highlight; the metric leads visually. */
export interface Highlight {
  /** The number, shown first, e.g. "5 → 30" or "40%". */
  metric: string;
  /** What the metric means. */
  summary: string;
}

/** An outbound link to a professional profile. */
export interface ProfileLink {
  /** Display label, e.g. "LinkedIn". */
  label: string;
  /** Absolute URL of the profile. */
  url: string;
}

// ─── PLACEHOLDER CONTENT ─────────────────────────────────────────────────────
// TODO(owner): replace every value below with your real details before go-live.
// `resumePdf` is intentionally omitted until a real public/resume.pdf exists;
// add `resumePdf: "/resume.pdf"` once the file is in place to show the download.
export const cvData: CvData = {
  name: "Your Name",
  title: "Engineering Leader",
  valueProp:
    "Engineering leader who builds and scales high-performing teams. TODO(owner): replace with your positioning statement.",
  roles: [
    {
      company: "Company A",
      position: "VP of Engineering",
      start: "2021",
      end: "Present",
      scope: "Led 30 engineers across 4 teams.",
    },
    {
      company: "Company B",
      position: "Engineering Manager",
      start: "2017",
      end: "2021",
      scope: "Grew and led a team of 8.",
    },
  ],
  impact: [
    {
      metric: "5 → 30",
      summary: "Scaled the engineering org while keeping delivery on track.",
    },
    {
      metric: "40%",
      summary: "Cut average delivery lead time through platform and process work.",
    },
  ],
  links: [
    { label: "GitHub", url: "https://github.com/carlsendk" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
  ],
};

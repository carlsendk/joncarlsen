// Astro content collections (ADR-003). The `work` collection holds project
// case studies as markdown: one file per deep-dive under src/content/work/,
// each rendered at /work/<slug> (the slug derives from the filename). The
// frontpage and /cv query this collection to list and link case studies.
//
// Adding a case study is just dropping in a markdown file that satisfies the
// schema below; no code or layout change is needed (the route is added in
// task_07). Invalid frontmatter fails the build, catching mistakes early.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  // Content Layer glob loader (Astro 5+). The entry id (slug) is the file path
  // relative to `base`, without the extension.
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    /** Case-study title. */
    title: z.string(),
    /** One-line teaser used on listing cards. */
    summary: z.string(),
    /** Role held during the work, e.g. "Director of Engineering & AI". */
    role: z.string(),
    /** Time span, e.g. "2023-Present". */
    period: z.string(),
    /** Company the project was delivered for; groups the /work index. */
    company: z.string(),
    /** Surfaces the project on the frontpage and /cv; all projects render a page regardless (ADR-003). */
    featured: z.boolean().default(false),
    // `themes` and `skills` are free-form strings with no enforced enum (ADR-004),
    // so the vocabulary can evolve without a schema change. Recommended starter
    // themes for consistency (not validated): ai-llm, platform-devex, org-scaling,
    // cloud-realtime-data, security-compliance, transformation.
    /** Free-form theme tags for selection (ADR-004). */
    themes: z.array(z.string()).default([]),
    /** Free-form skill tags for selection (ADR-004). */
    skills: z.array(z.string()).default([]),
    /** Headline metrics shown on cards (optional). */
    metrics: z.array(z.string()).default([]),
    /** Sort order for listings (lower first). */
    order: z.number().default(0),
    /** Drafts are excluded from generated pages and listings. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };

// Build-time impact derivation (ADR-004). The `work` collection is the canonical
// source of impact figures (ADR-003): every metric line on a non-draft work entry
// is an impact data point. This module is the single place those points are
// derived, so the home band, the /cv band, and /impact never re-author them.
//
// Imports `astro:content`, so it MUST be consumed only from `.astro` files in the
// build graph (Astro pages/components) — never from a non-Astro module top level.
// It produces no client JS: all work happens at build time.
import { getCollection } from "astro:content";

/** A single impact figure, derived from one string in a work entry's `metrics[]`. */
export interface ImpactItem {
  company: string;
  metric: string; // one entry per string in work.metrics[]
  slug: string; // work-collection id; links to /work/<slug>
  title: string;
  order: number;
}

/**
 * Every metric of every non-draft work entry, flattened in `work.order` order.
 * Drafts are excluded at query time; the collection `id` is the slug.
 */
export async function impactItems(): Promise<ImpactItem[]> {
  const work = (await getCollection("work", ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  return work.flatMap((e) =>
    e.data.metrics.map((metric) => ({
      company: e.data.company,
      metric,
      slug: e.id,
      title: e.data.title,
      order: e.data.order,
    })),
  );
}

/**
 * The first metric of each company (the lowest-`order` work that has metrics),
 * preserving first-seen company order. Companies with no metric do not appear.
 */
export async function leadImpactItems(): Promise<ImpactItem[]> {
  const seen = new Set<string>();
  return (await impactItems()).filter((i) =>
    seen.has(i.company) ? false : (seen.add(i.company), true),
  );
}

# Content gaps: information to supply

Planning artifact only (ADR-002). This file lives in the task folder and is never
part of the built site (not under `src/` or `public/`), so it carries no contact
details and never reaches a live page.

It is the single, prioritised checklist of the high-value figures still needed to
take the CV to full CTO-grade impact. Each entry maps one-to-one to a draft
`[TODO]` marker seeded in `src/data/cv.ts` (task_06). Every marker has an entry
here, and every entry names exactly one open marker, so filling a figure is a
tracked, unambiguous action.

How to use it: open `src/data/cv.ts` at the cited line, replace the bracketed
`[TODO: ...]` text with the real figure, and keep the surrounding sentence intact.
The render guard (`isReady`, ADR-003) hides any item that still holds a `[TODO`
marker, so a half-filled draft never leaks to the live site. Once the marker is
gone, the item renders automatically.

## Checklist (highest CTO-credibility impact first)

- [ ] **1. Annual technology budget owned**
  - **Supply**: the annual budget (or budget range) owned across engineering,
    platform, and AI, with the currency and the role it applied to.
  - **Marker**: `[TODO: budget owned]`
  - **Where it lands**: `impact[6].metric`, `cv.ts:394` (the "Annual technology
    budget owned across engineering, platform, and AI" impact highlight). The
    whole highlight is gated out until the figure is supplied.
  - **Why it matters**: budget and P&L ownership is the single clearest CTO signal
    a board or executive recruiter looks for, and it is the one hard-number gap
    that currently has no quantified claim on the page at all.

- [ ] **2. Cloud / operational cost reduction at Scrive**
  - **Supply**: the percentage operational cost reduction delivered by the
    zero-downtime move to containers and Kubernetes at Scrive.
  - **Marker**: `[TODO: cost reduction %]`
  - **Where it lands**: the second Scrive bullet, `roles[Scrive].bullets`,
    `cv.ts:254` ("cut operational cost by [TODO: cost reduction %]"). The bullet is
    gated out until both Scrive figures (this and entry 3) are supplied.
  - **Why it matters**: a quantified cost saving turns a delivery story into a
    business outcome and demonstrates financial stewardship at executive level.

- [ ] **3. Service SLA after the Scrive transformation**
  - **Supply**: the service SLA reached after the containers-and-Kubernetes move
    (ideally with the before figure, so the bullet can read as a before/after).
  - **Marker**: `[TODO: SLA % after]`
  - **Where it lands**: the same second Scrive bullet, `roles[Scrive].bullets`,
    `cv.ts:254` ("Lifted service SLA to [TODO: SLA % after]"). Shares the bullet
    with entry 2; both markers must clear for the bullet to render.
  - **Why it matters**: an SLA before/after is concrete proof of reliability
    ownership and operational rigour, the kind of measurable result a CTO is
    expected to stand behind.

- [ ] **4. Board / investor reporting cadence**
  - **Supply**: how often technology strategy and risk were reported to the board
    and investors (for example monthly, quarterly), and at which company.
  - **Marker**: `[TODO: board/investor cadence]`
  - **Where it lands**: the board-reporting credential, `credentials[7]`,
    `cv.ts:166` ("Reported technology strategy and risk to the board and investors
    on a [TODO: board/investor cadence] basis"). The credential is gated out until
    the cadence is supplied.
  - **Why it matters**: regular board and investor exposure is a defining CTO
    responsibility and separates executive scope from senior-management delivery.

## Coverage map (one-to-one with seeded `[TODO]` markers)

| Seeded marker in `cv.ts` | Location | Checklist entry |
| --- | --- | --- |
| `[TODO: budget owned]` | `impact[6].metric`, `cv.ts:394` | 1 |
| `[TODO: cost reduction %]` | `roles[Scrive].bullets`, `cv.ts:254` | 2 |
| `[TODO: SLA % after]` | `roles[Scrive].bullets`, `cv.ts:254` | 3 |
| `[TODO: board/investor cadence]` | `credentials[7]`, `cv.ts:166` | 4 |

Four seeded markers, four checklist entries, no marker or entry without a match.

A raw `grep '\[TODO' src/data/cv.ts` also returns two hits in the file's RENDER
GUARD comment block (`cv.ts:133` `[TODO: ...]` and `cv.ts:134` `[TODO: % YoY]`).
Those are illustrative examples in the ADR-003 documentation comment that explains
the sentinel format, not seeded content figures, so they are intentionally not
listed here.

## Named in the PRD, not yet seeded as markers (no entry above)

The PRD and ADR-002 also name **hiring velocity** and **retention** as high-value
figures. They have no `[TODO]` marker in `cv.ts` today, so they are deliberately
kept out of the one-to-one checklist above to preserve its exact marker coverage.
If the owner wants to track them, seed a gated `[TODO]` marker in the relevant
`cv.ts` item first, then add a matching checklist entry here.

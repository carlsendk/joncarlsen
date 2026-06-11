// Long-tail collapse toggle (ADR-003). Progressive enhancement: the page ships
// with the full experience timeline expanded; on load this collapses the earlier-
// roles tail (a below-the-fold region, so the shift never counts toward CLS) and
// wires the single bulk expander. The collapse is governed by a display-toggling
// class (`cv-collapsed`), NOT opacity, so revealed roles never get stuck at the
// `.reveal` fade — the reveal animation lives on the <section>, not on the tail.
//
// Extracted as a tiny importable module (sanctioned by the TechSpec: "a tiny
// shared module") so the toggle behaviour is unit-testable without a browser; the
// component's bundled, deferred <script> simply imports initCollapse() and calls
// it, preserving the ThemeToggle deferred-script idiom. A defensive early-return
// makes it a no-op wherever the tail/expander ids are absent (e.g. the condensed
// home-page timeline), so the script can be emitted unconditionally.

/** A minimal view of the document the toggle needs — lets tests pass a stub. */
type CollapseDoc = Pick<Document, "getElementById">;

export function initCollapse(doc: CollapseDoc = document): void {
  const tail = doc.getElementById("experience-tail");
  const btn = doc.getElementById("experience-expander");
  if (!tail || !btn) return;

  const count = btn.getAttribute("data-count") || "";
  const setState = (collapsed: boolean) => {
    tail.classList.toggle("cv-collapsed", collapsed);
    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    btn.textContent = collapsed ? `Show earlier roles (${count})` : "Hide earlier roles";
  };

  // Default SSR state is expanded; collapse the tail on load and reveal the
  // control that no-JS visitors never see (the button ships with `hidden`).
  setState(true);
  btn.hidden = false;
  btn.addEventListener("click", () => {
    setState(!tail.classList.contains("cv-collapsed"));
  });
}

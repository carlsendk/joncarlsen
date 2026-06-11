// Custom ESLint rule: canonical-scale (ADR-003, task 07).
//
// The stock Tailwind class-hygiene layer (task 06) enforces class validity,
// ordering, and an arbitrary-value restriction, but it has NO concept of "font
// size must come from the canonical scale" or "no colour literal in markup" —
// the exact drift signals this whole effort exists to prevent. This rule adds
// those two project-specific guards.
//
// It reports, inside `.astro` markup (class / className / class:list attributes):
//   1. A named font-size utility (text-xs … text-9xl) that is NOT in the
//      canonical allowlist — e.g. `text-lg`, `text-4xl`.
//   2. A colour literal — a `#hex`, an `rgb()/hsl()/oklch()` arbitrary, or a
//      Tailwind default-palette utility (`text-red-500`, `bg-blue-600`,
//      `text-white`). The project's SEMANTIC token utilities (`text-accent`,
//      `text-fg`, `text-muted`, `bg-bg`, `border-border`, …) are not in the
//      default palette and therefore pass.
//
// Role classes (`cv-*`), alignment utilities (`text-center`), arbitrary font
// sizes (`text-[0.625rem]`, left to the stock arbitrary-value restriction), and
// documented system arbitraries (`tracking-[0.2em]`) are all left untouched.

// Default options — mirror TechSpec "Core Interfaces" CanonicalScaleOptions and
// the cv-visual-design canonical type scale.
const DEFAULTS = {
  allowedTextSizes: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-5xl",
    "text-6xl",
  ],
  allowedArbitrary: ["tracking-[0.2em]"],
  banColorLiteralsInMarkup: true,
};

// Full Tailwind named font-size scale. Used to recognise a token AS a font-size
// utility (so `text-fg`/`text-center` are not mistaken for sizes); the allowlist
// then decides which named sizes are canonical.
const FONT_SIZE_NAMES = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];
const FONT_SIZE_RE = new RegExp(`^text-(?:${FONT_SIZE_NAMES.join("|")})$`);

// Tailwind default colour palette names. A colour-property utility built from one
// of these (optionally with a -shade and/or /opacity) is a colour literal. The
// project's semantic tokens are intentionally absent from this list.
const PALETTE = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const COLOR_PREFIXES = [
  "text",
  "bg",
  "border",
  "ring",
  "ring-offset",
  "fill",
  "stroke",
  "from",
  "via",
  "to",
  "decoration",
  "outline",
  "divide",
  "caret",
  "accent",
  "shadow",
  "placeholder",
];
const PALETTE_RE = new RegExp(
  `^(?:${COLOR_PREFIXES.join("|")})-(?:${PALETTE.join("|")}|white|black)(?:-\\d{1,3})?(?:/\\d{1,3})?$`,
);

// A `#hex` colour anywhere in the token (covers `text-[#1d4ed8]`, `border-[#fff]`).
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
// A CSS colour function inside an arbitrary value.
const COLOR_FN_RE = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb|color)\(/;

// Strip leading Tailwind variant prefixes (`sm:`, `hover:`, `dark:md:`) and a
// leading `!` important marker, returning the base utility. Colons INSIDE
// brackets/parens (arbitrary values like `text-[color:red]`) are not split on.
function baseUtility(cls) {
  let depth = 0;
  let lastColon = -1;
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i];
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") depth--;
    else if (ch === ":" && depth === 0) lastColon = i;
  }
  const afterVariants = lastColon >= 0 ? cls.slice(lastColon + 1) : cls;
  return afterVariants.replace(/^!/, "");
}

// Yield every static class string reachable from an attribute value, with the AST
// node to report against. Dynamic expressions (identifiers, conditionals) are
// skipped — only literal/template-literal text is inspected.
function* literalStrings(value) {
  if (!value) return;
  if (value.type === "Literal" && typeof value.value === "string") {
    yield { str: value.value, node: value };
    return;
  }
  if (value.type === "JSXExpressionContainer") {
    yield* literalStrings(value.expression);
    return;
  }
  if (value.type === "TemplateLiteral") {
    for (const quasi of value.quasis) {
      yield { str: quasi.value.cooked ?? quasi.value.raw, node: quasi };
    }
    return;
  }
  if (value.type === "ArrayExpression") {
    // Astro `class:list={["a", cond && "b"]}` — inspect the static string members.
    for (const el of value.elements) yield* literalStrings(el);
  }
}

function attributeName(node) {
  const n = node.name;
  if (!n) return "";
  if (n.type === "JSXNamespacedName") {
    return `${n.namespace.name}:${n.name.name}`;
  }
  return n.name ?? "";
}

const CLASS_ATTRS = new Set(["class", "className", "class:list"]);

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce the canonical font-size scale and ban colour literals in markup.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedTextSizes: { type: "array", items: { type: "string" } },
          allowedArbitrary: { type: "array", items: { type: "string" } },
          banColorLiteralsInMarkup: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      offScaleSize:
        'Font size "{{cls}}" is outside the canonical scale (allowed: {{allowed}}). Use a canonical size utility or a cv-* role class.',
      colorLiteral:
        'Colour literal "{{cls}}" is not allowed in markup; use a semantic token utility (text-accent, text-fg, text-muted, …).',
    },
  },

  create(context) {
    const options = { ...DEFAULTS, ...(context.options[0] ?? {}) };
    const allowedSizes = new Set(options.allowedTextSizes);
    const allowedArbitrary = new Set(options.allowedArbitrary);

    function checkClass(raw, node) {
      if (allowedArbitrary.has(raw)) return; // documented arbitrary (full match)
      const base = baseUtility(raw);
      if (allowedArbitrary.has(base)) return;

      if (options.banColorLiteralsInMarkup) {
        if (HEX_RE.test(raw) || COLOR_FN_RE.test(raw) || PALETTE_RE.test(base)) {
          context.report({ node, messageId: "colorLiteral", data: { cls: raw } });
          return;
        }
      }

      if (FONT_SIZE_RE.test(base) && !allowedSizes.has(base)) {
        context.report({
          node,
          messageId: "offScaleSize",
          data: { cls: raw, allowed: options.allowedTextSizes.join(", ") },
        });
      }
    }

    return {
      JSXAttribute(node) {
        if (!CLASS_ATTRS.has(attributeName(node))) return;
        for (const { str, node: valueNode } of literalStrings(node.value)) {
          for (const cls of str.split(/\s+/)) {
            if (cls) checkClass(cls, valueNode);
          }
        }
      },
    };
  },
};

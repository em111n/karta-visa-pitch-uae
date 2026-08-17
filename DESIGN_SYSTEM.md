# Karta Deck — Design System

Living reference for the visual language and reusable patterns. Source tokens live in [`colors_and_type.css`](colors_and_type.css). React primitives live in [`components.jsx`](components.jsx).

---

## 1 · Header pill (glass edge)

The fixed top nav uses a frosted-glass pill that expands on open.

### Anatomy
- **Background:** `--pp-glass-bg` (semi-opaque charcoal)
- **Backdrop filter:** `--pp-glass-blur` — blur + saturate
- **Border:** 1px `--pp-glass-border`
- **Top highlight overlay:** absolute child with `--pp-glass-highlight` gradient (180deg, white .07 → 0 at 70%). Provides convex sheen *without* the inset-shadow doubling that creates a visible 1px gap at the top edge.
- **Radius:** `--pp-r-card`
- **Width transition:** `width var(--pp-dur-slow) var(--pp-ease)` (300px → 900px on open)

### Do
- Use a **gradient overlay** for the glass sheen.
- Animate `width` only on open (asymmetric durations: slow on open, snappy on close).

### Don't
- ❌ Combine `border-top` with `inset 0 1px 0` highlight — they read as two parallel lines with a 1px gap.
- ❌ Add `scroll-behavior: smooth` to `html` and then call `window.scrollTo({behavior:"instant"})` — the option may be ignored. Set `documentElement.style.scrollBehavior = "auto"` around the jump and restore after.

---

## 2 · Pill hierarchy

Three sizes of pills with strict semantic ranks.

| Variant | When | Style | Token usage |
|---|---|---|---|
| **Primary (acid)** | One per slide — the call to action | Solid `--pp-acid` bg, `--pp-on-accent` text, `--pp-r-pill` radius | `<PillButton variant="accent">` |
| **Secondary (dark)** | Supporting actions, alt routes | Charcoal gradient bg, white text, `--pp-r-pill` radius | `<PillButton>` (no variant) |
| **Social / utility** | Compact icon-only or icon+label | `rgba(255,255,255,.05)` bg, 1px `rgba(255,255,255,.08)` border, hover lifts border to `--pp-acid-border` (32% acid) | 44×44 circular when icon-only, ~28px tall when labeled |

### Composition rule (Hero)
**Primary first, secondary second.** Eye reads acid → dark, supporting the primary action. See `sections-a.jsx` Hero CTAs: `See traction` (acid) + `Platform vision` (dark).

### Icon-only pill rules
- Fixed size: 44×44.
- SVG icon: 20×20.
- Use circular (`border-radius: 999px`).
- Hover: border swaps to acid 32%, bg to acid 8%.

---

## 3 · Slide divider + body sandwich

Every slide is two stacked sections:

```
<div className="chapter">
  <SectionHero id="..." num="..." kicker="..." parts={...} lead="..." />
  <Section tightTop style={{ background: "var(--pp-page)", position: "relative", zIndex: 2 }}>
    {body}
  </Section>
</div>
```

### Why z-index 2 on the body?
SectionHero's first section is `position: sticky; z-index: 0` with a **giant acid radial gradient** behind the chapter number/kicker (creating the "divider" beat). When the body Section follows it in normal flow, the sticky stays pinned to top and may bleed its acid through the body's transparent background.

**Fix:** the body Section needs explicit `background: var(--pp-page)` *and* `z-index: 2` (`--pp-z-section-body`) so it sits opaquely above the sticky.

### Do
- Wrap **every** slide (including the Close footer) in `<div className="chapter">` so sticky-recede scoping works.
- Use `tightTop` on the body Section — it shaves padding-top to butt directly under the divider.

### Don't
- ❌ Render content directly inside `<footer>` for the Close/Partnership slide — that breaks the sticky-recede pattern and creates an inconsistent visual rhythm.
- ❌ Add your own radial-gradient acid background to a body Section — it stacks with the divider's gradient and looks muddy.

---

## 4 · Authoritative two-up card pattern

For high-stakes contrastive content (e.g., "What we're asking" / "What Visa gets").

### Anatomy

```
┌────────────────────────────────────┐
│ 01    WHAT WE'RE ASKING            │   ← numbered prefix + uppercase headline
│ ─────────────────────────────────  │   ← hairline divider
│                                     │
│  · Bullet item one                 │
│  · Bullet item two                 │
│  · Bullet item three               │
└────────────────────────────────────┘
```

### Specs
- **Card padding:** `clamp(32px, 3.6vw, 56px) clamp(28px, 3.2vw, 48px)` — generous, authoritative
- **Radius:** 14px (slightly tighter than default `--pp-r-card` for editorial feel)
- **Number prefix:** 12px, `letter-spacing: .18em`, `--pp-fg-4` (or `--pp-acid` for accent card)
- **Headline:** `clamp(22px, 2vw, 30px)`, weight 800 / stretch 125%, uppercase, `.06em` letter-spacing
- **Hairline divider:** 1px `--pp-line` (neutral card) or `--pp-acid-divider` (acid card), 16-22px padding-bottom under headline
- **List items:** `clamp(18px, 2vw, 24px)`, weight 500, `--pp-fg`. Bullet: acid `·` at 1.2em, weight 700
- **Item gap:** `clamp(12px, 1.4vw, 18px)`

### Two variants
- **Neutral:** `border: 1px solid var(--pp-line)`, bg = white-tinted gradient (`rgba(255,255,255,.035 → .005)`)
- **Accent:** `border: 1px solid var(--pp-acid-border)`, bg = `--pp-acid-card-bg`. Headline + number color = `--pp-acid`.

### Mobile
Collapse to one column at ≤720px via media query on `.partner-cta-grid`.

---

## 5 · Menu UX rules

The hamburger pill expands into a two-column mega-menu (nav + contact panel).

### Open / close
- Click Menu button → opens; Click Close (or anywhere outside the pill) → closes; ESC → closes.
- **ESC handler MUST blur the active element** (`document.activeElement.blur()`) — otherwise a keyboard focus ring lingers around the Menu button after dismiss.
- Click-outside listener attached only when `open === true` (cleanup on close).

### Nav items
- `whiteSpace: nowrap` is mandatory — without it, two-word labels (Target audience, Where we operate) wrap mid-`width` transition during open, creating a visible "jump".
- **No per-item stagger.** Items appear together via the parent collapse. Per-item `translateY` + delay cascades read as jittery.

### Far-hop nav (fade-cut)
When clicking a section that's >1.5 viewports away:
1. Mount fixed overlay (z=`--pp-z-overlay`, solid `--pp-page`).
2. Fade overlay opacity 0 → 1 over `--pp-dur-fade`.
3. Set `documentElement.style.scrollBehavior = "auto"`, then `window.scrollTo(0, dest)` (instant), restore behavior.
4. Fade overlay 1 → 0.

Short hops keep normal smooth scroll. This prevents disorienting 35-viewport fly-throughs.

### Asymmetric close
The contact panel uses different transitions for open vs close:
- **Open:** `transform .5s var(--pp-ease) .12s, opacity .5s ease .12s` — delay lets the parent expand first
- **Close:** `transform .22s ease-in, opacity .18s ease-in` — no delay, fast tuck so content fades *with* the parent collapse, not after it (the delay-on-close caused the Karta App button to clip awkwardly).

---

## 6 · OG / link-preview spec

| Property | Value |
|---|---|
| **Size** | 1200 × 630 (1.91:1) — minimum 600 × 315 |
| **Format** | JPG or PNG (NOT SVG / WebP — many platforms drop these) |
| **Path** | `assets/og-cover.jpg` |
| **og:image URL** | Absolute, including domain |
| **og:url** | Include canonical URL |
| **Title** | `Karta × Visa · Partnership pitch` (deck-specific) |

### Cache refresh
Telegram caches link previews for days. To force refresh after update:
- Send the URL to [@WebpageBot](https://t.me/webpagebot) → resets Telegram's cache
- OR append a query param (`?v=2`) — Telegram treats it as a new URL

---

## Token reference (added this session)

```css
/* Motion variants */
--pp-ease-in:     cubic-bezier(0.55, 0, 0.4, 1);
--pp-dur-fast:    0.2s;
--pp-dur-snappy:  0.22s;
--pp-dur-slow:    0.55s;
--pp-dur-fade:    0.22s;

/* Z-index scale */
--pp-z-sticky-divider: 0;
--pp-z-section-body:   2;
--pp-z-header:        60;
--pp-z-overlay:     9999;

/* Acid surfaces */
--pp-acid-tint-1:   rgba(204, 255, 0, 0.02);
--pp-acid-tint-2:   rgba(204, 255, 0, 0.05);
--pp-acid-tint-3:   rgba(204, 255, 0, 0.08);
--pp-acid-tint-4:   rgba(204, 255, 0, 0.14);
--pp-acid-border:   rgba(204, 255, 0, 0.32);
--pp-acid-divider:  rgba(204, 255, 0, 0.18);
--pp-acid-card-bg:  linear-gradient(135deg, rgba(204,255,0,.08), rgba(204,255,0,.02) 70%);

/* Glass surface */
--pp-glass-bg:        rgba(20, 20, 20, 0.55);
--pp-glass-border:    rgba(255, 255, 255, 0.12);
--pp-glass-blur:      blur(22px) saturate(165%);
--pp-glass-highlight: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 70%);

/* Neutral card · V1 Elevated glass (Demo Day iteration) */
/* Replaces the previous #111 / .035 combo which was too subtle on the #030303 page. */
--pp-line:           #2a2a2a;   /* card border */
--pp-hairline-c:     #111;      /* thin dividers (row separators, table hairlines) */
--pp-card-bg:        linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.015) 70%);
```

### Neutral card pattern (V1 · Elevated glass)

Was picked over V2 (solid slate `#141414`) and V3 (thick outlined stroke `1.5px #333`) — glass keeps depth from the acid glow underneath while staying visible on the near-black page.

```jsx
<div style={{
  padding: "clamp(20px, 2.4vw, 32px)",
  borderRadius: 14,
  border: "1px solid var(--pp-line)",
  background: "var(--pp-card-bg)",
}}>
  {content}
</div>
```

Accent variant unchanged: acid border + acid gradient bg.

---

## Quick audit checklist

When adding a new slide or component, verify:

- [ ] Wrapped in `<div className="chapter">` if it has a divider
- [ ] Body Section has `background: var(--pp-page); z-index: 2; position: relative`
- [ ] Only **one** acid-primary CTA in the slide
- [ ] No raw `rgba(204,255,0,...)` — use `--pp-acid-tint-*` tokens
- [ ] No `inset 0 1px 0` on glass surfaces (use gradient overlay instead)
- [ ] Acid links open in `target="_blank"` with `rel="noopener noreferrer"`
- [ ] Cards with hierarchy use numbered prefix + uppercase headline + hairline divider
- [ ] Long copy uses `text-wrap: balance` on headings

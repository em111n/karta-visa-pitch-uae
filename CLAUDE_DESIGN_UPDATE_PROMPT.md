# Prompt for Claude Design — Karta Design System update

Open **Karta Design System** in Claude Design, then paste everything below this line as one message.

---

Update the Karta Design System with patterns and tokens from the latest Visa partnership pitch deck. Add these as new sections; don't remove existing ones unless explicitly noted.

## New design tokens

Add to the token sheet:

```css
/* Motion variants — durations and easings */
--pp-ease-in:     cubic-bezier(0.55, 0, 0.4, 1);
--pp-dur-fast:    0.2s;   /* hover / color transitions */
--pp-dur-snappy:  0.22s;  /* close, click feedback */
--pp-dur-slow:    0.55s;  /* expand / width transitions */
--pp-dur-fade:    0.22s;  /* fade-cut nav overlay */

/* Z-index scale */
--pp-z-sticky-divider: 0;
--pp-z-section-body:   2;
--pp-z-header:        60;
--pp-z-overlay:     9999;

/* Acid-tinted surfaces */
--pp-acid-tint-1:   rgba(204, 255, 0, 0.02);
--pp-acid-tint-2:   rgba(204, 255, 0, 0.05);
--pp-acid-tint-3:   rgba(204, 255, 0, 0.08);
--pp-acid-tint-4:   rgba(204, 255, 0, 0.14);
--pp-acid-border:   rgba(204, 255, 0, 0.32);
--pp-acid-divider:  rgba(204, 255, 0, 0.18);
--pp-acid-card-bg:  linear-gradient(135deg, rgba(204,255,0,.08), rgba(204,255,0,.02) 70%);

/* Glass surface — header pill, raised modals */
--pp-glass-bg:        rgba(20, 20, 20, 0.55);
--pp-glass-border:    rgba(255, 255, 255, 0.12);
--pp-glass-blur:      blur(22px) saturate(165%);
--pp-glass-highlight: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,0) 70%);
```

## New / refined patterns

### 1 — Header pill (glass edge)
A fixed-top nav pill that expands on open.
- Background `--pp-glass-bg`, backdrop-filter `--pp-glass-blur`
- 1px border `--pp-glass-border`, radius `--pp-r-card`
- Top sheen via absolute child with `--pp-glass-highlight` gradient (NOT via inset box-shadow — that creates a visible 1px gap at the top edge)
- Width transition: slow open (`--pp-dur-slow`), snappy close (`--pp-dur-snappy`)

### 2 — Pill hierarchy
| Variant | Use | Style |
|---|---|---|
| Primary acid | One per slide, the call to action | Solid `--pp-acid`, text `--pp-on-accent`, radius `--pp-r-pill` |
| Secondary dark | Supporting actions, alt routes | Charcoal gradient bg, white text, radius `--pp-r-pill` |
| Social/utility | Icon-only (44×44 circle) or icon+label compact pill | `rgba(255,255,255,.05)` bg + 1px white-8% border. Hover lifts border to `--pp-acid-border`, bg to `--pp-acid-tint-3` |

Composition rule: Primary first, secondary second. Eye reads acid → dark.

### 3 — Slide divider + body sandwich
Every slide is two stacked sections:
```
<div className="chapter">
  <SectionHero ... />
  <Section tightTop style={{ background: var(--pp-page), position: relative, zIndex: 2 }}>
    {body}
  </Section>
</div>
```
**Critical:** SectionHero's first section is `position: sticky; z-index: 0` with an acid radial-gradient backdrop. The body Section MUST have explicit `background: var(--pp-page)` AND `z-index: 2` — otherwise the acid bleeds through.

### 4 — Authoritative two-up card
For high-stakes contrastive content (e.g., asking ↔ getting).
- Padding `clamp(32px, 3.6vw, 56px) clamp(28px, 3.2vw, 48px)`
- Radius 14px
- Header row: `01` numeral prefix (12px, `.18em` letter-spacing, dim) + uppercase headline `clamp(22px, 2vw, 30px)`, weight 800, stretch 125%, `.06em` letter-spacing
- Hairline divider under header: 1px `--pp-line` (neutral) or `--pp-acid-divider` (accent)
- List items `clamp(18px, 2vw, 24px)`, acid `·` bullet at 1.2em weight 700
- Accent variant: border `--pp-acid-border`, bg `--pp-acid-card-bg`, headline color `--pp-acid`
- Mobile: collapse to one column at ≤720px

### 5 — Menu UX rules
- ESC closes menu AND blurs the active element (otherwise keyboard focus ring lingers)
- Click outside the pill closes the menu (listener only when `open === true`)
- Nav items: `whiteSpace: nowrap` (mandatory — without it two-word labels wrap mid-`width`-transition and create visible jumps)
- No per-item stagger animation — items appear together via parent collapse
- For nav targets >1.5 viewports away, use fade-cut: fixed overlay z=`--pp-z-overlay`, fade 0→1 in `--pp-dur-fade`, then `documentElement.style.scrollBehavior = "auto"` + instant `scrollTo`, restore, fade 1→0
- Close animations have no delay — content must fade with the parent collapse, not after it (otherwise the bottom CTA clips awkwardly)

### 6 — Open Graph spec
- Size: **1200 × 630** (1.91:1), minimum 600 × 315
- Format: **JPG or PNG** (never SVG or WebP — many platforms drop these)
- Path: `assets/og-cover.jpg`
- Use absolute URL for `og:image` and `og:url`
- To refresh Telegram cache after change: send link to @WebpageBot, OR append a query string

## Audit checklist for new slides

When adding a new slide or component:
- [ ] Wrapped in `<div className="chapter">` if it has a divider
- [ ] Body Section has `background: var(--pp-page); z-index: 2; position: relative`
- [ ] Only one acid-primary CTA per slide
- [ ] No raw `rgba(204,255,0,...)` — use `--pp-acid-tint-*` tokens
- [ ] No `inset 0 1px 0` on glass surfaces — use gradient overlay
- [ ] Acid links open in `target="_blank"` with `rel="noopener noreferrer"`
- [ ] Cards with hierarchy use numbered prefix + uppercase headline + hairline divider
- [ ] Long copy uses `text-wrap: balance` on headings

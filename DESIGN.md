# Design Brief

## Direction

School Attendance Manager — a professional, clean school administration interface for tracking and managing student attendance across 8 core modules.

## Tone

Trusted institutional authority with accessible clarity — corporate without coldness, functional without sterility.

## Differentiation

Structured left sidebar navigation with all 8 modules always visible, enabling teachers and administrators to switch contexts instantly without buried menus.

## Color Palette

| Token      | OKLCH       | Role                               |
| ---------- | ----------- | ---------------------------------- |
| background | 0.98 0.003 240 | Off-white primary surface          |
| foreground | 0.15 0.02 240  | Dark navy text, high contrast      |
| primary    | 0.35 0.12 240  | Deep navy for headers, key actions |
| accent     | 0.6 0.16 165   | Teal/green for monitoring, CTAs    |
| card       | 1.0 0.0 0      | Pure white card surfaces           |
| muted      | 0.92 0.006 240 | Light gray for secondary surfaces  |
| border     | 0.88 0.008 240 | Subtle card/input borders          |
| destructive| 0.577 0.245 27 | Red for warnings (fixed)           |

## Typography

- Display: Space Grotesk — clean, modern, geometric headings and module titles
- Body: DM Sans — neutral, highly readable, professional labels and body text
- Scale: h1/hero `text-4xl font-bold`, h2 `text-2xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Subtle shadow hierarchy: cards use `shadow-md`, interactive elements `shadow-lg` on hover, popovers `shadow-elevated` (0 12px 24px rgba(0,0,0,0.12)).

## Structural Zones

| Zone       | Background        | Border                    | Notes                                 |
| ---------- | ----------------- | ------------------------- | ------------------------------------- |
| Header     | primary (navy)    | none                      | White text, module title, icon        |
| Sidebar    | sidebar color     | sidebar-border            | 8 modules listed, active state teal   |
| Content    | background (off-white) | none                   | Main work area, spacious             |
| Cards      | card (white)      | border (light gray)       | Data containers, shadow-md            |
| Footer     | muted/30          | border-t                  | Support info, aligned right           |

## Spacing & Rhythm

Spacer 16px base: `gap-4` for card layouts, `p-6` for card padding, `p-8` for sections. Module cards and attendance records grouped in 2-3 column grids on desktop, stacked on mobile.

## Component Patterns

- Buttons: primary navy/teal, `rounded-lg`, `shadow-md` base, `shadow-lg hover:shadow-lg` on hover
- Cards: white bg, `border border-border`, `rounded-lg`, `shadow-md`
- Badges: teal bg for active/attended, gray for inactive/absent, rounded-full
- Sidebar: fixed left, navy primary color, white text, teal accent for active module

## Motion

- Entrance: fade-in staggered for card lists
- Hover: shadow elevation + text color shift (2–3px lift effect via shadow, no translation)
- Decorative: none — form over decoration

## Constraints

- No gradients, full opacity backgrounds only
- No decorative orbs, patterns, or animations beyond hover feedback
- Sidebar always visible on desktop; collapsible on mobile below `md` breakpoint
- 8 modules must be listed and accessible from sidebar at all times in layout

## Signature Detail

Teal accent buttons and badges pop against navy headers and white cards, signaling actionable items for daily attendance workflows.

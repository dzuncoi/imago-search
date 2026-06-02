---
name: Editorial Clarity
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  action-red: '#F87171'
  info-cyan: '#06B6D4'
  surface-subtle: '#F5F5F5'
  border-muted: '#E5E5E5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
spacing:
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  gutter: 1.5rem
  container-max-width: 1440px
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 3rem
---

## Brand & Style

This design system is built for high-performance visual discovery. It adopts a **Modern Editorial** aesthetic, characterized by extreme high contrast, rigorous Swiss-inspired typography, and a "frame-first" philosophy where the UI recedes to prioritize photographic content.

The style is unapologetically functional and structured. It utilizes a monochromatic foundation to establish authority and trust, while the strategic use of whitespace creates a premium, gallery-like atmosphere. The emotional response is one of precision, efficiency, and clarity, catering to media professionals and creative directors who require a tool that is both powerful and unobtrusive.

## Colors

The palette is anchored in absolute black and white to ensure maximum legibility and focus on imagery.

- **Primary & Secondary:** Absolute black (`#000000`) and a deep off-black (`#141414`) are used for text, iconography, and high-impact structural elements.
- **Neutrals:** White is the primary surface color, providing the "canvas" for the photography. Subtle grays are reserved for dividers and background zones to maintain a clean hierarchy.
- **Accents:** High-saturation red and cyan are used sparingly for functional indicators, such as destructive actions or specific metadata tags, ensuring they do not compete with the photography's natural color palette.

## Typography

The typography system uses **Hanken Grotesk** to replicate the sharp, contemporary feel of modern neo-grotesque typefaces. It provides a neutral but confident voice for headlines and body copy.

To complement the technical nature of photography metadata (ISO, aperture, licensing info), **JetBrains Mono** is introduced for labels and data points. This creates a clear visual distinction between editorial content and technical information.

- **Headlines:** Use tight tracking and bold weights for a "newsroom" impact.
- **Body:** Open line heights to ensure readability in long-form captions or descriptions.
- **Labels:** Always uppercase in small sizes for technical attributes to maintain a structured, systematic appearance.

## Layout & Spacing

This design system utilizes a **12-column fixed-grid** for desktop and a **fluid single-column** layout for mobile.

The layout is "search-centric," meaning the header is optimized for persistent access to search filters. Content is organized in a "Masonry" or "Strict Grid" format depending on the aspect ratio of the images being displayed.

- **Desktop:** 40px (2.5rem) side margins create a spacious frame.
- **Gaps:** A consistent 24px (1.5rem) gutter ensures images are distinct but visually connected.
- **Rhythm:** Vertical spacing follows a 4px baseline, with large `stack-lg` gaps between distinct content sections to reinforce the editorial feel.

## Elevation & Depth

This design system avoids traditional shadows to maintain its flat, editorial aesthetic. Depth is communicated through **Tonal Layering** and **High-Contrast Outlines**.

- **Surface Tiers:** The primary background is white. Secondary surfaces (like search sidebars or filter bars) use a very light gray (`#F5F5F5`).
- **Overlays:** When an image is hovered, a semi-transparent black overlay (60% opacity) may appear to reveal white text metadata.
- **Borders:** Use 1px solid lines in absolute black for interactive elements and light gray for structural dividers. This creates a "blueprint" feel that is precise and professional.
- **Focus:** No blurs are used. High-contrast state changes (e.g., black to white inversion) indicate focus and selection.

## Shapes

The shape language is strictly **Sharp (0px)**.

Every element—from buttons and input fields to image containers and chips—features 90-degree corners. This reinforces the architectural and grid-based nature of the design system, echoing the rectangular frame of a photograph. Circular elements are only permitted for specific functional icons (like a "Play" button on video content) to provide an immediate visual pivot from the structural UI.

## Components

- **Buttons:** Primary buttons are solid black with white text. Secondary buttons are white with a 1px black border. All buttons use uppercase labels in the mono font for a technical look. No gradients or rounded corners.
- **Search Bar:** A prominent, full-width component with a 1px black bottom border. It should use `headline-md` for the input text to emphasize its importance.
- **Chips/Tags:** Monospaced text inside a light gray box with 0px radius. Used for categories like "Editorial," "Sport," or "Creative."
- **Cards:** Image cards are borderless. Metadata is hidden by default and revealed on hover or placed strictly below the image in `label-sm` monospaced type.
- **Input Fields:** Minimalist design with only a bottom border that thickens from 1px to 2px on focus.
- **Checkboxes/Radios:** Square, sharp-edged boxes. Checked states use a solid black fill rather than a checkmark icon to maintain the minimalist graphic style.
- **Image Grid:** The core component. Must support lazy loading with a consistent `#F5F5F5` placeholder color to maintain the layout's visual stability.

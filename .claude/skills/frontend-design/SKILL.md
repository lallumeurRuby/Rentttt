---
name: frontend-design
description: Create production-grade frontend interfaces with Material Design 3 as the default visual style. Use when building web components, pages, applications, or styling and refining web UI.
---

Implement working, polished frontend code using **Material Design 3** as the default visual language. Apply it consistently across the main visual, page layouts, components, and interaction states. An explicit user request for another design style takes precedence.

## Design Thinking

Before coding, understand the page's purpose, audience, content hierarchy, and technical constraints. Express the product's identity through its brand color, imagery, and content while keeping a coherent Material Design 3 foundation.

Inspect existing components, theme configuration, and design tokens first. Reuse the project's framework and component library; adopting Material styling does not by itself require installing or replacing a UI library.

## Material Design 3 Guidelines

- **Color & Theme**: Define semantic CSS variables or theme tokens for primary, secondary, tertiary, surface, surface-container, outline, and error roles, with corresponding on-colors for readable foregrounds. Derive a cohesive tonal palette from the brand color. When dark mode is required, map the same semantic roles to dark-theme values instead of simply inverting colors.
- **Typography**: Use a consistent type scale with display, headline, title, body, and label roles. Roboto is allowed; use suitable CJK fonts such as Noto Sans TC for Traditional Chinese and provide readable fallbacks. Prioritize legibility and hierarchy over decorative font pairings.
- **Shape & Elevation**: Define reusable corner-radius and elevation tokens. Use surface tones and restrained shadows to distinguish layers; apply shape consistently by component role.
- **Layout & Main Visual**: Use clear alignment, responsive grids, consistent spacing, and generous breathing room. Give the hero a clear headline, supporting content, and a primary action. Brand imagery or illustration should reinforce the message and preserve text contrast.
- **Components**: Follow Material 3 component anatomy and hierarchy for buttons, cards, text fields, chips, dialogs, and navigation. Distinguish primary, secondary, and tertiary actions through consistent variants. Keep equivalent components visually consistent across pages.
- **Interaction States**: Provide default, hover, focus-visible, pressed, selected, disabled, and error states where applicable. Use state layers and visible keyboard focus. Show validation and loading feedback clearly.
- **Motion**: Use purposeful transitions to explain state changes and maintain continuity. Keep motion restrained, use consistent duration and easing tokens, and respect prefers-reduced-motion.
- **Accessibility**: Maintain readable contrast, semantic markup, keyboard operation, and accessible labels. Aim for 48 by 48 CSS-pixel touch targets for primary touch interactions.

Avoid arbitrary gradients, decorative noise, exaggerated shadows, and grid-breaking layouts unless the user's brief calls for them. Do not prohibit standard fonts or familiar component patterns when they support Material consistency and usability.

## Implementation & Review

Build functional HTML/CSS/JS, React, Vue, or the project's existing stack. Centralize shared visual values in tokens rather than scattering hardcoded colors, radii, shadows, and spacing throughout components.

Review the result for consistent color roles, typography, spacing, shapes, action hierarchy, responsive behavior, and interaction states. Preserve the requested functionality and existing accessibility behavior when restyling.

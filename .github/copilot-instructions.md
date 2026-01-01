## InOut360 AI Guide

### Stack & Commands
- Vite + React 18 + TypeScript front-end; Tailwind drives styling via [tailwind.config.ts](tailwind.config.ts) and CSS tokens in [src/index.css](src/index.css).
- UI primitives copy the shadcn pattern under [src/components/ui](src/components/ui); they rely on `class-variance-authority`, Radix primitives, and the `cn` helper from [src/lib/utils.ts](src/lib/utils.ts).
- Development flow stays client-only: `npm run dev` for Vite, `npm run build` for production, `npm run preview` to test the bundle, and `npm run lint` for ESLint (see [package.json](package.json)).

### Application Layout & Navigation
- The single entry point [src/main.tsx](src/main.tsx) mounts `<App />` only; there is no router, server API, or persisted state.
- [src/App.tsx](src/App.tsx) owns layout chrome (pinned header + glassmorphic tab bar) and a single `activeNav` state that decides which workflow is visible; add new journeys by switching the JSX rendered inside `<main>` based on that state.
- Header and bottom buttons already include aria labels and iconography (Lucide). Maintain that pattern for new interactive controls.

### Product Surface & Data Contracts
- Functional expectations live in [APP_DESCRIPTION.md](APP_DESCRIPTION.md); treat it as the product spec when expanding the placeholder `<main>` content.
- Mock datasets (`quickInsights`, `historyEntries`, `preferenceToggles`, `taskOptions`) are centralized in [src/data/mock-data.ts](src/data/mock-data.ts). When prototyping new cards or forms, import from that file rather than sprinkling literals.
- There is intentionally no fetch layer. Simulate side effects with local `useState` blocks or derived data so that hot reload remains instant.

### Design System & Styling Conventions
- Stick to Tailwind utility classes backed by theme tokens (e.g., `bg-primary`, `text-muted`); colors and radii are defined through CSS variables in [src/index.css](src/index.css) and surfaced in [tailwind.config.ts](tailwind.config.ts).
- Global typography uses Space Grotesk + General Sans; keep headings at `font-semibold` and prefer rounded radii (`rounded-[24px]`) to match the neumorphic shell.
- Use the provided shadcn wrappers (Button, Card, Input, Select, Sheet, etc.) instead of ad-hoc markup; they already forward refs, variants, and focus rings.

### Interaction Patterns
- The floating bottom navigation is the primary view switcher (`bottomNavItems` in [src/App.tsx](src/App.tsx)); when adding a new tab, update the discriminated union `BottomNavId` and handle keyboard focus states.
- Header quick actions are modeled around the Menu button; future sheets or dialogs should lean on Radix components already pulled into the project.
- Forms are presentational only—never wire real submissions. Surface intent via CTA labels, statuses, and pills per the behavior spelled out in [APP_DESCRIPTION.md](APP_DESCRIPTION.md).

### Implementation Tips
- Co-locate small view-specific helpers next to `App.tsx`, but keep reusable primitives inside `src/components/ui` so variant logic stays centralized.
- Favor derived UI state over multiple booleans (e.g., use enums like `BottomNavId`); it keeps the faux-navigation logic and animations predictable.
- Asset imports (like `logoIcon` from [src/assets](src/assets)) can be handled through Vite; keep them under `src/assets` to benefit from Vite's path resolution.

# NorthStar-Frontend

Enterprise goal lifecycle and performance operations UI built with React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form, Zod, Recharts, and Sonner.

NorthStar is the frontend workspace for a role-aware performance management product. The application gives employees, managers, and admins a single operational console for goal creation, approval, quarterly tracking, shared goals, organization visibility, audit review, and admin governance.


## Table of Contents

- [Project Overview](#project-overview)
- [Product Features](#product-features)
- [Frontend Tech Stack](#frontend-tech-stack)
- [Frontend Architecture](#frontend-architecture)
- [Folder Structure](#folder-structure)
- [Routing & Navigation Flow](#routing--navigation-flow)
- [Authentication Flow](#authentication-flow)
- [UI / Design System](#ui--design-system)
- [Dashboard Architecture](#dashboard-architecture)
- [State & Data Flow](#state--data-flow)
- [Organization Tree](#organization-tree)
- [Charts & Analytics](#charts--analytics)
- [Performance & UX Considerations](#performance--ux-considerations)
- [Accessibility & UX Decisions](#accessibility--ux-decisions)
- [Architecture Diagrams](#architecture-diagrams)
- [Theme System Diagram](#theme-system-diagram)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Engineering Highlights](#engineering-highlights)

## Project Overview

NorthStar Frontend is a production-oriented SPA for managing enterprise goals across employee, manager, and admin workflows.

The frontend solves three core UX problems:

| Problem | Frontend Response |
| --- | --- |
| Goal workflows differ by role | Route guards, role-specific navigation, and dashboard workspaces render only the relevant operational surface. |
| Goal data changes frequently | TanStack Query owns server state, invalidation, loading states, retries, and stale-time behavior. |
| Enterprise UI must stay consistent | Shared primitives, semantic CSS tokens, dark mode, status badges, panels, cards, modals, and form controls keep screens coherent. |

Frontend goals:

- Provide a fast, role-aware operations console.
- Keep business flows modular by domain.
- Centralize API access, auth persistence, route protection, and semantic styling.
- Make dashboards, forms, charts, modals, and hierarchy views reusable and maintainable.

## Product Features

| Area | Implemented Frontend Capability |
| --- | --- |
| Role-based workflows | Employee, Manager, Admin, and HR roles exist in frontend types/navigation. Employee, Manager, and Admin have protected route groups. HR currently routes to login. |
| Employee dashboard | Shows goal counts, locked goals, in-review goals, average progress, goal sheet readiness, workflow summary, and shared goal count. |
| Employee goal workspace | Create, edit, delete draft goals, select goals for submission, submit valid goal sets, perform quarterly check-ins, and request unlocks. |
| Manager dashboard | Shows pending review, locked goals, team member count, tracked groups, and a review queue preview. |
| Manager approvals | Managers approve goals with optional adjustments or return goals with comments. |
| Quarterly tracking | Employees submit quarterly progress; managers review tracked goals and add quarterly comments. |
| Admin dashboard | Provides organization metrics, unlock governance, analytics charts, export action, and embedded organization hierarchy. |
| Employee onboarding | Admins provision accounts through an internal form with role, identity, department, and manager assignment fields. |
| Audit logs | Admin logs page supports action and user filtering. |
| Shared goals | Managers and admins can push shared goals to employee IDs and inspect pushed shared goal copies. |
| Organization hierarchy | Protected organization page renders a recursive, expandable reporting tree with summary statistics and horizontal overflow handling. |
| Dark mode | Theme provider persists light/dark mode in local storage and applies semantic CSS tokens across the app. |

## Frontend Tech Stack

| Technology | Purpose | Why It Fits This Frontend |
| --- | --- | --- |
| React 19 | Component runtime | Supports a modular SPA with composable layouts, forms, workspaces, and shared UI primitives. |
| TypeScript | Static typing | Models role, auth, goal, hierarchy, analytics, audit, and API response shapes. |
| Vite | Dev server and build tool | Fast local development, simple production builds, and first-class React plugin support. |
| React Router | Client-side routing | Centralized route tree, nested layouts, protected routes, role guards, lazy pages, and SPA navigation. |
| TanStack Query | Server state | Query caching, loading/error states, mutation invalidation, retries, and stale-time configuration. |
| Zustand | Auth state | Small persistent store for user, access token, refresh token, login, and logout. |
| Axios | HTTP client | Central API instance with base URL configuration, bearer token injection, and `401` logout handling. |
| Tailwind CSS v4 | Styling system | Semantic theme tokens are declared in CSS and consumed through utility classes. |
| React Hook Form | Form state | Efficient form handling for login, goal forms, shared goals, onboarding, and modals. |
| Zod | Validation | Runtime validation schemas for login, goal, shared goal, and onboarding forms. |
| Recharts | Analytics visualization | Responsive bar, line, and pie charts for admin analytics. |
| Lucide React | Icons | Consistent icon language for navigation, actions, metrics, and empty states. |
| Sonner | Toasts | User feedback for login, mutations, exports, approvals, unlocks, and errors. |
| ESLint | Code quality | TypeScript, React Hooks, React Refresh, and browser globals linting. |

### Build & Configuration

| File | Frontend Role |
| --- | --- |
| `vite.config.ts` | Registers React and Tailwind CSS Vite plugins and defines the `@` alias for `src`. |
| `src/index.css` | Owns Tailwind v4 imports, semantic `@theme` mappings, light/dark CSS variables, global focus styles, surfaces, shadows, scrollbars, and reduced-motion behavior. |
| `tsconfig.json` / `tsconfig.app.json` | Enables strict TypeScript, bundler module resolution, `react-jsx`, path aliasing, and unused code checks. |
| `eslint.config.js` | Applies JavaScript, TypeScript, React Hooks, React Refresh, and browser global lint rules. |
| `vercel.json` | Rewrites all routes to `index.html` for SPA deep-link support. |

Tailwind is configured through the Tailwind CSS v4 CSS-first approach in `src/index.css`; there is no separate `tailwind.config.*` file in this repository.

## Frontend Architecture

The app uses a layered frontend architecture:

1. `main.tsx` wires global providers, routing, styles, and toast infrastructure.
2. `src/app` owns app-level concerns: router, navigation, providers, and auth store.
3. `src/layouts` defines shell-level rendering.
4. `src/pages` maps routes to screen-level page components.
5. `src/modules` contains domain features with local API functions, hooks, utilities, and workspace components.
6. `src/components` contains cross-domain UI and auth guard primitives.
7. `src/services` centralizes API client behavior, endpoints, toast helpers, and API error parsing.
8. `src/types` contains shared frontend types for auth, goals, organization, audit logs, and analytics.

### Architectural Philosophy

- **Domain modules own business UI.** Employee, manager, admin, organization, shared goals, and quarterly features are isolated under `src/modules`.
- **Pages stay thin.** Most pages delegate to workspaces or compose high-level cards and hooks.
- **Server state is explicit.** Data access flows from API function to React Query hook to workspace component.
- **Global state is minimal.** Zustand is used only for persisted auth state.
- **Styling is semantic.** Components use design tokens such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`, and status tones.
- **Enterprise surfaces are reusable.** Panels, metric tiles, status badges, modal shells, form controls, skeletons, empty states, and error states provide consistent operational UI.

## Folder Structure

```text
NorthStar-Frontend/
|--- public/
|   `--- favicon.svg
|--- src/
|   |--- app/
|   |   |--- navigation.ts
|   |   |--- providers/
|   |   |   |--- query-provider.tsx
|   |   |   |--- theme-context.ts
|   |   |   |--- theme-provider.tsx
|   |   |   `--- use-theme.ts
|   |   |--- router/
|   |   |   `--- index.tsx
|   |   `--- store/
|   |       `--- auth-store.ts
|   |--- components/
|   |   |--- auth/
|   |   |   |--- ProtectedRoute.tsx
|   |   |   `--- RoleProtectedRoute.tsx
|   |   `--- ui/
|   |       |--- button.tsx
|   |       |--- card.tsx
|   |       |--- confirmation-dialog.tsx
|   |       |--- empty-state.tsx
|   |       |--- error-state.tsx
|   |       |--- form.tsx
|   |       |--- header.tsx
|   |       |--- loading-skeleton.tsx
|   |       |--- page-header.tsx
|   |       |--- sidebar.tsx
|   |       |--- stat-card.tsx
|   |       |--- status-badge.tsx
|   |       `--- surface.tsx
|   |--- layouts/
|   |   |--- AuthLayout.tsx
|   |   `--- DashboardLayout.tsx
|   |--- modules/
|   |   |--- admin/
|   |   |--- auth/
|   |   |--- employee/
|   |   |--- manager/
|   |   |--- organization/
|   |   |--- quarterly/
|   |   `--- shared-goals/
|   |--- pages/
|   |   |--- admin/
|   |   |--- employee/
|   |   |--- manager/
|   |   |--- organization/
|   |   |--- shared-goals/
|   |   |--- LoginPage.tsx
|   |   |--- NotFoundPage.tsx
|   |   `--- UnauthorizedPage.tsx
|   |--- services/
|   |   |--- api.ts
|   |   |--- api-error.ts
|   |   |--- endpoints.ts
|   |   `--- toast.ts
|   |--- types/
|   |   |--- auth.ts
|   |   `--- goal.ts
|   |--- index.css
|   `--- main.tsx
|--- vite.config.ts
|--- vercel.json
|--- tsconfig.json
`--- package.json
```

### Module Pattern

Most feature modules follow this structure:

```text
module/
|--- api/          # Axios calls for this feature
|--- hooks/        # TanStack Query hooks and mutations
|--- components/   # Feature workspace and presentational components
`--- utils/        # Mappers, validation helpers, grouping, analytics transforms
```

## Routing & Navigation Flow

Routing is centralized in `src/app/router/index.tsx` using `createBrowserRouter`.

### Route Groups

| Route | Access | Layout | Purpose |
| --- | --- | --- | --- |
| `/login` | Public | Login page | Email or employee ID login. |
| `/employee/*` | `EMPLOYEE` | `DashboardLayout` | Employee dashboard and goal workspace. |
| `/manager/*` | `MANAGER` | `DashboardLayout` | Manager dashboard, review queue, and progress tracking. |
| `/admin/*` | `ADMIN` | `DashboardLayout` | Admin dashboard, onboarding, and audit logs. |
| `/organization` | Authenticated users | `DashboardLayout` | Organization hierarchy. |
| `/shared-goals` | `MANAGER`, `ADMIN` | `DashboardLayout` | Shared goal push and inspection. |
| `/unauthorized` | Public | Standalone page | Role mismatch target. |
| `*` | Public | Standalone page | Not found page. |

### Navigation

Role-specific navigation lives in `src/app/navigation.ts`.

| Role | Navigation Items |
| --- | --- |
| Employee | Dashboard, Organization, My Goals |
| Manager | Dashboard, Organization, Review Goals, Progress, Shared Goals |
| Admin | Dashboard, Employee Onboarding, Goal Oversight, Organization, Audit Logs |
| HR | Dashboard entry currently points to login |

Route-level pages are lazy-loaded with `React.lazy` and wrapped in `Suspense` with a `LoadingSkeleton` fallback.

## Authentication Flow

Frontend auth is implemented with:

- `src/modules/auth/auth-service.ts` for login/register calls.
- `src/app/store/auth-store.ts` for persisted auth state.
- `ProtectedRoute` for token/user checks.
- `RoleProtectedRoute` for allowed-role checks.
- Axios request/response interceptors in `src/services/api.ts`.

### Token Handling

- Login accepts either email or employee ID.
- Successful login stores `user`, `accessToken`, and optional `refreshToken` in the persisted Zustand store under `northstar-auth`.
- Axios reads the persisted access token and attaches `Authorization: Bearer <token>` to API requests.
- A non-auth `401` response triggers `logout()` and clears persisted auth state.

### Protected UI

- Unauthenticated users are redirected to `/login`.
- Authenticated users with the wrong role are redirected to `/unauthorized`.
- Navigation is generated from the current user role.
- The header and sidebar read the persisted user to show identity, department, designation, and role.

## UI / Design System

The UI system is implemented with Tailwind CSS v4, semantic CSS custom properties, shared primitives, and feature-level composition.

### Semantic Theme Architecture

Theme tokens are declared in `src/index.css`:

| Token Category | Examples |
| --- | --- |
| Base | `--background`, `--foreground` |
| Surfaces | `--card`, `--surface`, `--muted` |
| Text | `--card-foreground`, `--surface-foreground`, `--muted-foreground` |
| Borders and focus | `--border`, `--input`, `--ring` |
| Brand/action | `--primary`, `--secondary`, `--accent` |
| Status | `--success`, `--warning`, `--destructive`, `--info` |
| Interaction | `--hover`, `--active` |

Tailwind maps these variables through `@theme`, allowing components to use semantic classes such as:

```tsx
<div className="dashboard-surface bg-card text-card-foreground border-border" />
```

### Dark Mode System

- `ThemeProvider` initializes from `localStorage` key `northstar-theme`.
- If no saved preference exists, it uses `prefers-color-scheme`.
- The provider toggles `.dark` and `.light` on `document.documentElement`.
- CSS custom properties redefine the same semantic tokens in dark mode.
- Login and dashboard header both expose a theme toggle.

### Reusable Primitives

| Primitive | Purpose |
| --- | --- |
| `Button` | Variant-based action button: primary, secondary, danger, ghost. |
| `Panel`, `SectionCard`, `MetricTile` | Enterprise dashboard surfaces and nested metric blocks. |
| `ModalShell`, `ModalFooter` | Shared modal foundation with focus, escape close, scroll locking, header, body, footer. |
| `Field`, `Input`, `Textarea`, `Select` | Accessible form controls with error states. |
| `StatusBadge`, `ProgressBadge` | Tone-based badges for lifecycle and status signals. |
| `LoadingSkeleton` | Route and data loading fallback. |
| `ErrorState` | Error display with optional retry action. |
| `EmptyState` | Structured empty screens with icons and actions. |
| `Header`, `Sidebar` | Dashboard shell navigation and user controls. |

### Modal System

Feature modals use `ModalShell` for consistent behavior:

- Goal create/edit modal.
- Quarterly check-in modal.
- Unlock request modal.
- Manager approval modal.
- Manager return modal.
- Quarterly comment modal.
- Confirmation dialog primitive.

`ModalShell` handles:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- initial focus on dialog container
- Escape key close
- body scroll lock
- bounded viewport height with internal scrolling

### Form System

Forms use React Hook Form and Zod for validation:

- Login validates identifier and password.
- Goal forms validate title, thrust area, UOM, measurement type, target value, weightage, and target date rules.
- Shared goal forms validate recipients, UOM, measurement, default weightage, and timeline date requirements.
- Employee onboarding validates identity, role, credential, department, and reporting fields.

Goal forms also support shared-goal read-only behavior: shared goal details remain owner-managed while editable fields such as weightage can still be changed where allowed.

### Responsive Strategy

- `DashboardLayout` uses a fixed-height app shell with scrollable main content.
- Sidebar is persistent on desktop and overlay-based on mobile.
- Header condenses controls across breakpoints.
- Dashboard grids move from single-column to multi-column layouts using Tailwind breakpoints.
- Organization tree uses horizontal overflow and `min-w-max` node layout for wide teams.
- Modals use max-width variants and viewport-constrained body scrolling.

## Dashboard Architecture

### Employee Dashboard

The employee dashboard uses `useMyGoals()` to load personal and shared goals, then derives:

- total goals
- locked goals
- submitted/in-review goals
- editable goals
- completed goals
- total weightage
- average progress across locked goals
- shared goal count

The employee goal workspace supports:

- draft creation and editing
- submission selection
- submission validation for total weightage and goal count
- quarterly check-ins for locked goals
- unlock requests
- shared-goal display and restricted editing rules

### Manager Dashboard

The manager dashboard combines:

- review goals from `useReviewGoals()`
- progress goals from `useManagerGoals()`
- employee grouping utilities from `modules/manager/utils/review-goals.ts`

Manager review and progress screens use separate workspaces:

- `ManagerReviewWorkspace` groups submitted goals by employee and opens approve/return modals.
- `ManagerProgressWorkspace` groups locked goals by employee and opens quarterly comment modals.

### Admin Dashboard

The admin dashboard loads multiple queries:

- organization hierarchy
- audit logs
- completion dashboard
- QoQ analytics
- goal distribution analytics

It renders:

- operational metric cards
- unlock request panel
- direct unlock panel
- CSV export action
- analytics charts
- organization hierarchy

Admin onboarding and logs are separate route-level workflows.

### Shared Patterns

Across dashboards:

- data loading happens through query hooks
- visual state is handled before rendering the main workspace
- derived metrics use local utilities or memoized calculations
- mutations invalidate affected query keys
- toast feedback confirms user actions

## State & Data Flow

### API Interaction Strategy

All HTTP traffic goes through `src/services/api.ts`.

```text
VITE_API_BASE_URL
    v
Axios instance
    v
Feature API function
    v
TanStack Query hook / mutation
    v
Workspace component
    v
Shared UI primitive
```

Default API base URL:

```text
http://localhost:8000
```

Override with:

```text
VITE_API_BASE_URL=https://your-api-host
```

### Query Strategy

`QueryProvider` configures:

| Option | Value |
| --- | --- |
| `refetchOnWindowFocus` | `false` |
| `retry` | `1` |
| `staleTime` | `60_000` ms |

Query keys are colocated with feature hooks, for example:

- `["my-goals"]`
- `["manager-review-goals"]`
- `["manager-goals"]`
- `["admin-audit-logs"]`
- `["admin-unlock-requests"]`
- `["organization-hierarchy"]`
- `["pushed-shared-goals"]`

Mutations invalidate the smallest known affected query sets.

### Component Data Flow

```text
API response
  -> normalize/map utility when needed
  -> query hook
  -> workspace screen
  -> derived metrics/grouping
  -> presentational cards, tables, charts, forms, modals
```

Examples:

- Employee goal fetching combines personal goals and shared goals, normalizes quarter maps, and sorts by creation date.
- Manager check-in API responses are normalized into the shared `Goal` frontend shape.
- Admin analytics utilities convert audit logs, hierarchy, QoQ analytics, and distribution responses into chart-ready data.

## Organization Tree

The organization hierarchy is implemented in `src/modules/organization`.

| File | Role |
| --- | --- |
| `api/organization-api.ts` | Fetches `/organization/hierarchy`. |
| `hooks/use-organization-hierarchy.ts` | Provides query hook and query key. |
| `components/organization-tree.tsx` | Renders tree container, stats, sticky guidance row, and horizontal overflow area. |
| `components/org-tree-node.tsx` | Recursive memoized node renderer with expand/collapse state. |

UX decisions:

- Root-level nodes are visually emphasized with a primary ring.
- Nodes show employee name, role, designation, department, direct report count, and employee ID.
- Nodes default open for the first two levels.
- Expand/collapse buttons expose `aria-expanded` and descriptive labels.
- Wide reporting structures are handled with horizontal scrolling instead of compressing cards beyond readability.
- Tree nodes use `memo` to avoid unnecessary rerenders when surrounding state changes.

## Charts & Analytics

Admin analytics use Recharts in `src/modules/admin/components/admin-charts.tsx`.

Chart types currently implemented:

| Chart | Rendering Strategy |
| --- | --- |
| Department Headcount | Responsive bar chart from hierarchy-derived counts. |
| Goal Distribution by Thrust Area | Responsive donut/pie chart from distribution analytics. |
| Team QoQ Average Progress | Responsive line chart from QoQ team metrics. |
| Goal Distribution by UoM | Responsive bar chart from distribution analytics. |
| Goal Lifecycle Signals | Responsive donut/pie chart from audit-derived lifecycle counts. |
| Audit Action Distribution | Responsive bar chart from audit log action counts. |

Chart UX details:

- Uses `ResponsiveContainer` for dashboard resizing.
- Uses semantic CSS variables for chart color, grid, and axis styling.
- Uses compact X-axis label formatting for long labels.
- Uses a custom tooltip styled with the same card/border/shadow tokens as the rest of the UI.
- Shows structured empty chart states when analytics data is missing.

## Performance & UX Considerations

- Route-level lazy loading keeps page bundles separated by major workflow.
- TanStack Query prevents manual fetch boilerplate and centralizes stale-time, retry, caching, and invalidation.
- Derived dashboard values are computed locally and memoized where grouping/selection work can grow.
- Recursive organization nodes are memoized.
- Shared primitives reduce styling duplication and keep UI changes scalable.
- Semantic tokens allow global theme updates without rewriting component class names.
- Main layout uses constrained max width and scrollable content to avoid full-page overflow issues.
- Modals cap height to the viewport and scroll internally.
- Organization tree uses horizontal overflow for wide structures.
- Loading, empty, and error states exist across main workspaces.
- Toast feedback is used consistently after mutations.
- API errors are normalized through `getApiErrorMessage` where used by screens.

## Accessibility & UX Decisions

Implemented accessibility and UX foundations:

- Focus-visible styling is globally defined with semantic ring color.
- Theme toggle buttons include `aria-label` and `title`.
- Sidebar mobile overlay has close labels and a backdrop button.
- Navigation uses `NavLink` and `aria-label="Primary navigation"`.
- Modal dialogs include `role="dialog"`, `aria-modal`, generated `aria-labelledby`, Escape handling, body scroll lock, and initial focus.
- Form controls expose invalid state through `aria-invalid` in shared form primitives.
- Field errors use `aria-live="polite"`.
- Organization tree expand/collapse controls expose `aria-expanded` and descriptive labels.
- Reduced motion preference disables long transitions and animations.
- Dark mode uses distinct semantic tokens for contrast rather than simple opacity inversion.

Known accessibility gaps worth addressing:

- Modal focus is initialized but not fully trapped.
- Some feature-specific forms still use direct input styling instead of the shared form primitives.
- Search in the header is currently presentational text, not an implemented search input.

## Architecture Diagrams

### Frontend Architecture

```text
main.tsx
  |-- ThemeProvider
  |-- QueryProvider
  |-- RouterProvider
  `-- Sonner Toaster

Router
  |-- Public routes
  |   |-- /login
  |   |-- /unauthorized
  |   `-- *
  `-- Protected route groups
      |-- /employee/*
      |-- /manager/*
      |-- /admin/*
      |-- /organization
      `-- /shared-goals

Feature Modules
  |-- api
  |-- hooks
  |-- components
  `-- utils

Shared Foundation
  |-- components/ui
  |-- services
  |-- types
  `-- lib
```

### Component Hierarchy

```text
DashboardLayout
  |-- Sidebar
  |   `-- role-based NavLink list
  |-- Header
  |   |-- mobile menu button
  |   |-- user context
  |   |-- theme toggle
  |   `-- logout action
  `-- main scroll region
      `-- Outlet
          `-- Page
              `-- Workspace
                  |-- query state
                  |-- derived metrics
                  |-- cards / tables / charts
                  `-- modals / forms
```

### Auth Flow

```text
LoginPage
  |-- React Hook Form + Zod validation
  |-- loginUser(payload)
  |   `-- POST /auth/login
  |-- useAuthStore.setAuth(user, access, refresh)
  |-- toast.success
  `-- navigate(roleHomePath[user.role])

Protected request
  |-- Axios request interceptor
  |-- read northstar-auth from localStorage
  |-- attach Authorization bearer token
  `-- API response
      `-- 401 outside auth routes -> logout()
```

### Dashboard Flow

```text
Role home path
  |-- EMPLOYEE -> /employee/dashboard
  |   |-- useMyGoals()
  |   `-- Employee metrics + goal readiness
  |-- MANAGER -> /manager/dashboard
  |   |-- useReviewGoals()
  |   |-- useManagerGoals()
  |   `-- review/progress summary
  `-- ADMIN -> /admin/dashboard
      |-- useOrganizationHierarchy()
      |-- useAuditLogs()
      |-- useCompletionDashboard()
      |-- useQoqAnalytics()
      |-- useGoalDistributionAnalytics()
      `-- metrics + governance + charts + tree
```

## Theme System Diagram

```text
index.css
  |-- :root semantic CSS variables
  |-- .dark semantic CSS variables
  |-- @theme Tailwind token mapping
  `-- utility classes
      |-- dashboard-surface
      |-- inset-panel
      |-- enterprise-shadow
      `-- theme-transition

ThemeProvider
  |-- read localStorage("northstar-theme")
  |-- fallback to prefers-color-scheme
  |-- apply .light / .dark to <html>
  `-- persist next theme

Components
  `-- use semantic classes
      |-- bg-background
      |-- bg-card
      |-- text-foreground
      |-- text-muted-foreground
      |-- border-border
      |-- bg-primary
      `-- text-destructive
```

## Local Setup

### Prerequisites

- Node.js compatible with the project dependencies.
- npm.
- A running NorthStar backend API.

### Install Dependencies

```bash
npm install
```

### Environment

Create a local environment file if the backend is not running at the default URL:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

The app reads `VITE_API_BASE_URL` and removes a trailing slash if present. If the variable is missing, it defaults to:

```text
http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

The build script runs TypeScript project build first, then Vite production build:

```bash
tsc -b && vite build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

This frontend is compatible with static SPA hosting such as Vercel.

Deployment requirements:

- Set `VITE_API_BASE_URL` in the hosting provider environment.
- Build with `npm run build`.
- Serve the generated Vite output as a single-page app.
- Ensure client-side routes fall back to `index.html`.

The repository includes `vercel.json` with an SPA rewrite:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents direct visits such as `/manager/review` or `/admin/logs` from returning a host-level 404.

## Engineering Highlights

- **Role-aware frontend architecture:** route guards, role home paths, role-specific sidebars, and restricted shared-goal/admin flows.
- **Enterprise UI primitives:** panels, metric tiles, modal shell, field controls, skeletons, empty/error states, status badges, dashboard header, and sidebar.
- **Semantic design system:** light/dark themes are token-driven and consumed through Tailwind utilities.
- **Scalable feature modules:** API, hooks, components, and utilities are colocated by domain.
- **Server-state discipline:** TanStack Query handles cache, invalidation, retry, loading, and error paths.
- **Minimal global state:** auth is the only persisted global client state.
- **Operational UX:** dashboards emphasize counts, queues, progress, governance, audit visibility, and workflow actions.
- **Chart-ready analytics layer:** admin utilities transform backend responses into Recharts-friendly view models.
- **Hierarchy visualization:** recursive organization tree supports expand/collapse and wide-team inspection.
- **Deployment-aware SPA configuration:** Vercel rewrite supports deep links and browser refreshes.
# NorthStar-Frontend

Enterprise goal lifecycle and performance operations UI built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, Zustand, React Hook Form, Zod, Recharts, and Sonner.

NorthStar is the frontend workspace for a role-aware performance management and goal governance portal. The application gives employees, managers, and administrators a unified operational console for goal formulation, mathematical weightage validation, manager calibration and lockdown, sequential quarterly check-ins, cascaded shared KPIs, organization hierarchy inspection, audit trails, and admin governance—complete with interactive `i` tooltips (`InfoTooltip`) explaining every goal detail and measurement formula across the UI.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Product Features](#product-features)
- [Goal Measurement, UoM & Mathematical Scoring System](#goal-measurement-uom--mathematical-scoring-system)
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

---

## Project Overview

NorthStar Frontend is a production-oriented SPA for managing enterprise goals across employee, manager, and admin workflows.

The frontend solves four core UX problems:

| Problem | Frontend Response |
| --- | --- |
| Goal workflows differ by role | Route guards (`ProtectedRoute`, `RoleProtectedRoute`, `PublicOnlyRoute`), role-specific navigation, and dedicated workspaces render only the relevant operational surface. |
| Complex KPI math & governance rules | Contextual `i` button tooltips (`InfoTooltip` + `src/lib/goal-help.ts`) explain every field, UoM (`NUMERIC`, `PERCENTAGE`, `TIMELINE`, `ZERO_BASED`), measurement direction (`MIN` / `MAX`), formula, status badge, and timestamp in place. |
| Goal data changes frequently | TanStack Query owns server state, cache invalidation, loading skeletons, retry actions, and stale-time behavior. |
| Enterprise UI must stay consistent | Shared primitives, semantic CSS tokens, light/dark mode, status badges, panels, metric tiles, modals, and form controls keep screens coherent. |

Frontend goals:

- Provide a fast, role-aware operations console.
- Keep business flows modular by domain.
- Centralize API access, auth persistence, route protection, IST date formatting, and semantic styling.
- Make dashboards, forms, charts, modals, tooltips, and hierarchy views reusable and maintainable.

---

## Product Features

| Area | Implemented Frontend Capability |
| --- | --- |
| Public showcase landing page (`/`) | Interactive product overview with simulated live goal cards, 5-stage lifecycle walkthrough, mathematical scoring formulas, role console tabs, architecture breakdown, and session-aware CTAs. |
| Self-service registration & login | Public-only `/login` and `/register` pages with React Hook Form + Zod validation; authenticated users are automatically routed to their role workspace. |
| Role-based workflows | Employee, Manager, Admin, and HR roles exist in frontend types/navigation. Employee, Manager, and Admin have protected route groups. |
| Ubiquitous `i` button tooltips | Portal-based `InfoTooltip` (`i` button) on every goal detail, UoM, `MIN`/`MAX` measurement direction, target, weightage, status badge, quarterly check-in metric, manager note, chart header, and timestamp. |
| Employee dashboard | Shows total goals, locked goals, in-review goals, average progress, 100% goal sheet readiness bar, workflow summary, and shared goal count. |
| Employee goal workspace | Create, edit, and delete draft goals, select goals for batch submission, validate 100% total active weightage (up to 8 active goals), log sequential Q1–Q4 check-ins, and submit unlock requests. |
| Manager dashboard | Shows pending review count, locked goals, team member count, tracked groups, and a review queue preview. |
| Manager approvals & calibration | Managers approve goals (with optional inline calibration of `target_value` and `weightage`) or return goals with mandatory feedback notes. |
| Quarterly tracking | Employees log sequential Q1–Q4 achievements and progress statuses; managers inspect progress timelines and add quarterly review comments. |
| Shared goals (KPI cascade) | Managers and admins select multiple recipients via a searchable employee picker (marking the first recipient as Primary Owner), push cascaded KPIs, and monitor pushed copies. |
| Admin dashboard | Provides organization KPI cards, pending unlock request review, direct goal unlock control, 6 Recharts analytics visualizations, CSV achievement export, and the organization hierarchy tree. |
| Employee onboarding | Admins provision employee/manager/HR/admin accounts with identity, department, designation, and reporting manager fields. |
| Audit logs | Admin audit log workspace with action-category filtering, user search, and IST timestamps. |
| Organization hierarchy | Protected organization page renders a recursive, expandable reporting tree with summary statistics and horizontal overflow handling. |
| Dark mode | Theme provider persists light/dark mode in `localStorage` and applies semantic CSS tokens across the app. |

---

## Goal Measurement, UoM & Mathematical Scoring System

NorthStar enforces strict mathematical rules for goal definition, submission readiness, and quarterly progress calculation. Every rule is surfaced directly in the UI through `src/lib/goal-help.ts` and `src/components/ui/info-tooltip.tsx`.

### 1. Units of Measurement (`UOMType`) & Progress Formulas

| UoM Type | Measurement Direction (`MeasurementType`) | Progress Formula | Typical Enterprise Use Cases |
| --- | --- | --- | --- |
| `NUMERIC` | `MIN` (Higher is better) | `(Achievement / Target) × 100%` | Revenue, units sold, new enterprise accounts, releases shipped. |
| `NUMERIC` | `MAX` (Lower is better) | `(Target / Achievement) × 100%` | Service turnaround time (TAT), cloud cost, defect count, MTTR. |
| `PERCENTAGE` | `MIN` (Higher is better) | `(Achievement / Target) × 100%` | SLA uptime %, test coverage %, customer retention rate. |
| `PERCENTAGE` | `MAX` (Lower is better) | `(Target / Achievement) × 100%` | Customer churn %, error rate %, cart abandonment rate. |
| `TIMELINE` | Date-based (`target_date` required) | `100%` if completed on/before `target_date`; proportional daily reduction when delayed | Product launch milestones, compliance certification deadlines, migration cutovers. |
| `ZERO_BASED` | Automatically `MIN` (Zero tolerance) | `Achievement == 0 ? 100% : 0%` | Critical safety incidents, regulatory breaches, Sev-1 security outages. |

### 2. Weightage & Submission Governance

- **Per-Goal Weightage**: Each goal must carry between **10% and 100%** weightage.
- **Total Active Weightage**: Batch submission requires the sum of selected editable goals (`DRAFT`, `RETURNED`, `ADMIN_UNLOCKED`) plus already `LOCKED` goals to equal **exactly 100%**.
- **Active Goals Cap**: Employees can maintain a maximum of **8 active goals** in their goal sheet.

### 3. The 5-Stage Goal Lifecycle (`GoalStatus`)

| Status | Meaning | Who Can Act |
| --- | --- | --- |
| `DRAFT` | Initial goal created by an employee or pushed as a shared goal copy. | Employee can edit all fields (or weightage-only for shared goals), delete (non-shared), and select for submission. |
| `SUBMITTED` | Batch-submitted to the reporting manager after passing the 100% weightage check. | Locked for employee editing; awaits Manager approval or return. |
| `RETURNED` | Sent back by the manager with a mandatory `manager_note` explaining required revisions. | Employee can revise fields and resubmit. |
| `LOCKED` | Approved by the manager. Target and weightage are frozen for the performance cycle. | Employee logs sequential `Q1 -> Q2 -> Q3 -> Q4` check-ins; Employee can request an Admin Unlock if priorities shift. |
| `ADMIN_UNLOCKED` | Temporarily reopened by an Admin (via unlock request approval or direct unlock). | Employee can update the goal and resubmit for manager approval. |

### 4. Interactive `i` Tooltips (`InfoTooltip`)

- Implemented in `src/components/ui/info-tooltip.tsx` and backed by `src/lib/goal-help.ts`.
- Renders a compact `i` icon button next to form labels (`FieldLabel`), KPI cards (`StatCard`, `MetricCard`), goal cards (`GoalCard`, `ReviewGoalCard`, `ManagerProgressCard`), modals (`ApproveGoalModal`, `ReturnGoalModal`, `QuarterlyCheckinModal`, `QuarterlyCommentModal`, `UnlockRequestModal`), quarterly timelines (`QuarterlyTimeline`), shared goal workspaces (`SharedGoalsWorkspace`), admin charts (`AdminCharts`), and landing page previews (`LandingPage`).
- Supports **hover**, **keyboard focus**, and **click-to-pin** (with `Escape` and outside-click dismissal) and renders in a `document.body` portal so popovers are never clipped by `overflow-hidden` cards or modals.

---

## Frontend Tech Stack

| Technology | Purpose | Why It Fits This Frontend |
| --- | --- | --- |
| React 19 | Component runtime | Supports a modular SPA with composable layouts, portals, forms, workspaces, and shared UI primitives. |
| TypeScript | Static typing | Models role, auth, goal, UoM, measurement, hierarchy, analytics, audit, and API response shapes. |
| Vite | Dev server and build tool | Fast local development, clean code-splitting, and first-class React plugin support. |
| React Router v7 | Client-side routing | Centralized route tree, nested layouts, protected routes, public-only routes, role guards, and lazy pages. |
| TanStack Query v5 | Server state | Query caching, loading/error states, mutation invalidation, retries, and stale-time configuration. |
| Zustand | Auth state | Lightweight persistent store for user, access token, refresh token, login, and logout. |
| Axios | HTTP client | Central API instance with base URL normalization, bearer token injection, and `401` logout handling. |
| Tailwind CSS v4 | Styling system | Semantic theme tokens declared in CSS and consumed through utility classes. |
| React Hook Form | Form state | Performant form handling and live field watching (`useWatch`) for dynamic UoM/measurement tooltips. |
| Zod | Validation | Runtime validation schemas for login, registration, goal creation, shared goal push, check-ins, and onboarding. |
| Recharts | Analytics visualization | Responsive bar, line, and donut charts for admin governance analytics. |
| Lucide React | Icons | Consistent icon language for navigation, actions, metrics, tooltips, and empty states. |
| Sonner | Toasts | User feedback for auth, mutations, CSV exports, approvals, unlocks, and errors. |
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

---

## Frontend Architecture

The app uses a layered frontend architecture:

1. `main.tsx` wires global providers (`ThemeProvider`, `QueryProvider`), routing (`RouterProvider`), styles, and toast infrastructure (`Toaster`).
2. `src/app` owns app-level concerns: router, role navigation helpers, providers, and persisted auth store.
3. `src/layouts` defines shell-level rendering (`AuthLayout`, `DashboardLayout`).
4. `src/pages` maps routes to screen-level page components.
5. `src/modules` contains domain features with colocated API functions, TanStack Query hooks, utilities, and workspace components.
6. `src/components` contains cross-domain UI primitives (`InfoTooltip`, `ModalShell`, `FieldLabel`, `StatCard`, etc.) and auth guard components.
7. `src/lib` provides shared utilities including `goal-help.ts` (contextual help catalog), `datetime.ts` (`Asia/Kolkata` IST formatting), and `utils.ts` (`cn` class merger).
8. `src/services` centralizes API client behavior, endpoint constants, toast helpers, and API error parsing.
9. `src/types` contains shared TypeScript interfaces for auth, goals, organization hierarchy, audit logs, and analytics.

### Architectural Philosophy

- **Domain modules own business UI.** Employee, manager, admin, organization, shared goals, and quarterly features are isolated under `src/modules`.
- **Pages stay thin.** Most pages delegate to workspaces or compose high-level cards and hooks.
- **Server state is explicit.** Data access flows from API function to React Query hook to workspace component.
- **Global state is minimal.** Zustand is used only for persisted auth state.
- **Self-documenting UI.** Every domain metric and form control pairs with `InfoTooltip` and `src/lib/goal-help.ts` so users never have to guess how a metric or formula works.
- **Styling is semantic.** Components use design tokens such as `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, `bg-primary`, and status tones.

---

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
|   |   |   |--- PublicOnlyRoute.tsx
|   |   |   `--- RoleProtectedRoute.tsx
|   |   `--- ui/
|   |       |--- button.tsx
|   |       |--- card.tsx
|   |       |--- confirmation-dialog.tsx
|   |       |--- empty-state.tsx
|   |       |--- error-state.tsx
|   |       |--- form.tsx
|   |       |--- header.tsx
|   |       |--- info-tooltip.tsx
|   |       |--- loading-skeleton.tsx
|   |       |--- page-header.tsx
|   |       |--- sidebar.tsx
|   |       |--- stat-card.tsx
|   |       |--- status-badge.tsx
|   |       `--- surface.tsx
|   |--- layouts/
|   |   |--- AuthLayout.tsx
|   |   `--- DashboardLayout.tsx
|   |--- lib/
|   |   |--- datetime.ts
|   |   |--- goal-help.ts
|   |   `--- utils.ts
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
|   |   |   |--- AdminDashboard.tsx
|   |   |   |--- AdminLogsPage.tsx
|   |   |   `--- EmployeeOnboardingPage.tsx
|   |   |--- employee/
|   |   |   |--- EmployeeDashboard.tsx
|   |   |   `--- MyGoalsPage.tsx
|   |   |--- manager/
|   |   |   |--- ManagerDashboard.tsx
|   |   |   |--- ManagerProgressPage.tsx
|   |   |   `--- ReviewGoalsPage.tsx
|   |   |--- organization/
|   |   |   `--- OrganizationPage.tsx
|   |   |--- shared-goals/
|   |   |   `--- SharedGoalsPage.tsx
|   |   |--- LandingPage.tsx
|   |   |--- LoginPage.tsx
|   |   |--- NotFoundPage.tsx
|   |   |--- RegisterPage.tsx
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
|--- API_Documentation.md
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
|--- components/   # Feature workspace, cards, modals, and presentational components
`--- utils/        # Mappers, validation helpers, grouping, analytics transforms
```

---

## Routing & Navigation Flow

Routing is centralized in `src/app/router/index.tsx` using `createBrowserRouter`.

### Route Groups

| Route | Access | Guard / Layout | Purpose |
| --- | --- | --- | --- |
| `/` | Public | Standalone (`LandingPage`) | Product overview, live telemetry preview, lifecycle & scoring guide, and role console links. |
| `/login` | Public-only | `PublicOnlyRoute` | Email or employee ID login; redirects authenticated users to their role home path. |
| `/register` | Public-only | `PublicOnlyRoute` | Employee self-registration form; redirects authenticated users to their role home path. |
| `/employee/*` | `EMPLOYEE` | `ProtectedRoute` + `RoleProtectedRoute` + `DashboardLayout` | Employee dashboard (`/employee/dashboard`) and goal workspace (`/employee/goals`). |
| `/manager/*` | `MANAGER` | `ProtectedRoute` + `RoleProtectedRoute` + `DashboardLayout` | Manager dashboard (`/manager/dashboard`), review queue (`/manager/review`), and progress tracking (`/manager/progress`). |
| `/admin/*` | `ADMIN` | `ProtectedRoute` + `RoleProtectedRoute` + `DashboardLayout` | Admin dashboard (`/admin/dashboard`), employee onboarding (`/admin/onboarding`), and audit logs (`/admin/logs`). |
| `/organization` | Authenticated users | `ProtectedRoute` + `DashboardLayout` | Interactive organization reporting hierarchy tree. |
| `/shared-goals` | `MANAGER`, `ADMIN` | `ProtectedRoute` + `RoleProtectedRoute` + `DashboardLayout` | Shared goal (cascaded KPI) push and monitoring workspace. |
| `/unauthorized` | Public | Standalone page | Role mismatch feedback screen. |
| `*` | Public | Standalone page | 404 Not Found page. |

### Navigation

Role-specific navigation and role home paths (`getRoleHomePath`) live in `src/app/navigation.ts`.

| Role | Home Path | Navigation Items |
| --- | --- | --- |
| Employee | `/employee/dashboard` | Dashboard, Organization, My Goals |
| Manager | `/manager/dashboard` | Dashboard, Organization, Review Goals, Progress, Shared Goals |
| Admin | `/admin/dashboard` | Dashboard, Employee Onboarding, Goal Oversight, Organization, Audit Logs |
| HR | `/login` | Dashboard entry currently points to login |

Route-level pages are lazy-loaded with `React.lazy` and wrapped in `Suspense` with a `LoadingSkeleton` fallback.

---

## Authentication Flow

Frontend auth is implemented with:

- `src/modules/auth/auth-service.ts` for login (`POST /auth/login`) and registration (`POST /auth/register`) calls.
- `src/app/store/auth-store.ts` for persisted auth state (`northstar-auth` in `localStorage`).
- `PublicOnlyRoute` to keep authenticated users out of `/login` and `/register`.
- `ProtectedRoute` for token/user session checks.
- `RoleProtectedRoute` for role-level authorization checks.
- Axios request/response interceptors in `src/services/api.ts`.

### Token Handling

- Login accepts either corporate email or employee ID (`identifier`).
- Successful login stores `user`, `accessToken`, and optional `refreshToken` in the persisted Zustand store under `northstar-auth`.
- Axios reads the persisted access token and attaches `Authorization: Bearer <token>` to API requests.
- A non-auth `401` response triggers `logout()` and clears persisted auth state.

### Protected UI

- Unauthenticated users visiting protected routes are redirected to `/login`.
- Authenticated users visiting `/login` or `/register` are redirected to their role home path.
- Authenticated users with a mismatched role are redirected to `/unauthorized`.
- The header and sidebar read the persisted user to display identity, department, designation, and role.

---

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
- If no saved preference exists, it falls back to `prefers-color-scheme`.
- The provider toggles `.dark` and `.light` on `document.documentElement`.
- CSS custom properties redefine the same semantic tokens in dark mode.
- Landing page, login, register, and dashboard header all expose a theme toggle.

### Reusable Primitives

| Primitive | Purpose |
| --- | --- |
| `InfoTooltip` | Portal-based `i` icon button displaying title, description, formula badge, and highlighted breakdown items on hover, focus, or click-to-pin. |
| `Button` | Variant-based action button: `primary`, `secondary`, `danger`, `ghost`. |
| `Panel`, `SectionCard`, `MetricTile` | Enterprise dashboard surfaces and nested metric blocks. |
| `StatCard`, `MetricCard` | KPI summary cards with icon, value, label, and optional `tooltip` (`GoalHelpContent`). |
| `ModalShell`, `ModalFooter` | Shared modal foundation with focus initialization, `Escape` close, scroll locking, header, body, and footer. |
| `Field`, `FieldLabel`, `Input`, `Textarea`, `Select` | Accessible form controls with error states and built-in `tooltip` support on `FieldLabel`. |
| `StatusBadge`, `ProgressBadge` | Tone-based badges for lifecycle (`DRAFT`, `SUBMITTED`, `RETURNED`, `LOCKED`, `ADMIN_UNLOCKED`) and progress signals. |
| `LoadingSkeleton` | Route and data loading fallback. |
| `ErrorState` | Error display with optional retry action. |
| `EmptyState` | Structured empty screens with icons and actions. |
| `Header`, `Sidebar` | Dashboard shell navigation and user controls. |

### Modal System

Feature modals use `ModalShell` for consistent behavior and include a goal summary `SectionCard` with `InfoTooltip` buttons on every metric:

- Goal create/edit modal (`GoalModal` + `GoalForm`).
- Quarterly check-in modal (`QuarterlyCheckinModal`).
- Unlock request modal (`UnlockRequestModal`).
- Manager approval & calibration modal (`ApproveGoalModal`).
- Manager return modal (`ReturnGoalModal`).
- Quarterly comment modal (`QuarterlyCommentModal`).
- Confirmation dialog primitive (`ConfirmationDialog`).

---

## Dashboard Architecture

### Employee Dashboard & My Goals Workspace

The employee dashboard (`src/pages/employee/EmployeeDashboard.tsx`) uses `useMyGoals()` to load personal and shared goals, then derives:

- Total goals (`GOAL_HELP.goalDefinition`)
- Locked goals (`getGoalStatusHelp("LOCKED")`)
- In-review goals (`getGoalStatusHelp("SUBMITTED")`)
- Average progress across locked goals (`GOAL_HELP.quarterlyProgressSection`)
- Total weightage readiness bar (`GOAL_HELP.submissionReadiness`)
- Workflow counts for Draft/Returned, Completed, and Shared goals

The employee goal workspace (`src/modules/employee/components/my-goals-workspace.tsx`) supports:

- Draft creation and editing with live context-sensitive UoM and `MIN`/`MAX` measurement tooltips
- Goal selection and 100% total active weightage validation (up to 8 active goals)
- Sequential Q1–Q4 check-ins for locked goals
- Unlock requests for locked goals
- Manager return feedback callouts and full IST lifecycle timestamps (`Created`, `Submitted`, `Approved`, `Returned`, `Updated`)

### Manager Dashboard, Review & Progress Workspaces

The manager dashboard (`src/pages/manager/ManagerDashboard.tsx`) combines:

- Pending review goals from `useReviewGoals()`
- Locked progress goals from `useManagerGoals()`
- Employee grouping utilities from `src/modules/manager/utils/review-goals.ts`

Manager review and progress screens use dedicated workspaces:

- `ManagerReviewWorkspace` groups submitted goals by employee and opens `ApproveGoalModal` (supporting inline `target_value` and `weightage` calibration) or `ReturnGoalModal`.
- `ManagerProgressWorkspace` groups locked goals by employee, displays `ManagerProgressCard` and `QuarterlyTimeline`, and opens `QuarterlyCommentModal` for Q1–Q4 manager feedback.

### Shared Goals Workspace

`SharedGoalsWorkspace` (`src/modules/shared-goals/components/shared-goals-workspace.tsx`) enables managers and admins to cascade departmental KPIs:

- Uses `useOrganizationHierarchy()` to populate a searchable multi-select employee picker.
- Marks the first selected employee as **Primary owner** (whose quarterly check-ins automatically sync across all recipients' copies).
- Provides live context-sensitive tooltips on `UoM Type` and `Measurement (MIN/MAX)` and lists all pushed shared goal copies with status, target, UoM, measurement, recipient, and timestamp tooltips.

### Admin Dashboard, Onboarding & Audit Logs

The admin dashboard (`src/modules/admin/components/admin-dashboard-workspace.tsx`) loads five parallel queries:

- Organization hierarchy (`useOrganizationHierarchy`)
- Audit logs (`useAuditLogs`)
- Completion dashboard (`useCompletionDashboard`)
- QoQ analytics (`useQoqAnalytics`)
- Goal distribution analytics (`useGoalDistributionAnalytics`)

It renders:

- Operational metric cards (`Total Employees`, `Total Goals`, `Locked Goals`, `Quarterly Completion`) with `InfoTooltip` explanations
- `UnlockRequestsPanel` (approve/reject employee unlock requests) and `UnlockGoalPanel` (direct unlock by Goal ID)
- One-click CSV achievement report export (`GET /admin/export-achievement-report`)
- 6 Recharts analytics visualizations (`AdminCharts`)
- Embedded `OrganizationTree`

---

## State & Data Flow

### API Interaction Strategy

All HTTP traffic goes through `src/services/api.ts`.

```text
VITE_API_BASE_URL
    v
Axios instance (Bearer token + 401 handler)
    v
Feature API function
    v
TanStack Query hook / mutation
    v
Workspace component
    v
Shared UI primitive + InfoTooltip
```

Default API base URL:

```text
http://localhost:8000
```

Override with:

```bash
VITE_API_BASE_URL=https://your-api-host
```

### Query Strategy

`QueryProvider` configures:

| Option | Value |
| --- | --- |
| `refetchOnWindowFocus` | `false` |
| `retry` | `1` |
| `staleTime` | `60_000` ms |

Query keys are colocated with feature hooks:

- `["my-goals"]`
- `["manager-review-goals"]`
- `["manager-goals"]`
- `["admin-audit-logs"]`
- `["admin-unlock-requests"]`
- `["organization-hierarchy"]`
- `["pushed-shared-goals"]`

Mutations invalidate the smallest known affected query sets.

---

## Organization Tree

The organization hierarchy is implemented in `src/modules/organization`:

| File | Role |
| --- | --- |
| `api/organization-api.ts` | Fetches `GET /organization/hierarchy`. |
| `hooks/use-organization-hierarchy.ts` | Provides query hook and query key (reused by Admin, Organization page, and Shared Goals employee picker). |
| `components/organization-tree.tsx` | Renders tree container, summary stats, sticky guidance row, and horizontal overflow area. |
| `components/org-tree-node.tsx` | Recursive memoized node renderer with expand/collapse state. |

---

## Charts & Analytics

Admin analytics use Recharts in `src/modules/admin/components/admin-charts.tsx`.

| Chart | Tooltip Help | Rendering Strategy |
| --- | --- | --- |
| Department Headcount | — | Responsive bar chart from hierarchy-derived counts. |
| Goal Distribution by Thrust Area | `GOAL_HELP.thrustArea` | Responsive donut chart from distribution analytics. |
| Team QoQ Average Progress | `GOAL_HELP.quarterlyProgressSection` | Responsive line chart from QoQ team metrics. |
| Goal Distribution by UoM | `GOAL_HELP.uomType` | Responsive bar chart from distribution analytics. |
| Goal Lifecycle Signals | `GOAL_HELP.goalDefinition` | Responsive donut chart from audit-derived lifecycle counts. |
| Audit Action Distribution | — | Responsive bar chart from audit log action counts. |

---

## Performance & UX Considerations

- Route-level lazy loading keeps page bundles separated by workflow (`LandingPage`, `MyGoalsPage`, `ReviewGoalsPage`, `ManagerProgressPage`, `SharedGoalsPage`, `AdminDashboard`, `AdminLogsPage`, `EmployeeOnboardingPage`, `OrganizationPage`).
- TanStack Query centralizes stale-time, retry, caching, and invalidation.
- Derived dashboard values are computed locally and memoized where grouping/selection work can grow.
- Recursive organization nodes (`OrgTreeNode`) and quarterly timelines (`QuarterlyTimeline`) are memoized with `React.memo`.
- `InfoTooltip` uses `createPortal(..., document.body)` and viewport clamping so tooltips never cause layout shifts or clip inside scrollable containers.
- All dates and timestamps are formatted consistently in Indian Standard Time (`Asia/Kolkata`, `IST`) via `src/lib/datetime.ts`.

---

## Accessibility & UX Decisions

- Focus-visible styling is globally defined with semantic ring color.
- `InfoTooltip` buttons include `aria-label`, `aria-expanded`, keyboard focus support, click-to-pin toggle, and `Escape` key dismissal.
- Theme toggle buttons include `aria-label` and `title`.
- Sidebar mobile overlay has close labels and a backdrop button.
- Navigation uses `NavLink` and `aria-label="Primary navigation"`.
- Modal dialogs include `role="dialog"`, `aria-modal`, generated `aria-labelledby`, `Escape` handling, body scroll lock, and initial focus.
- Form controls expose invalid state through `aria-invalid` and polite live-region error messages (`aria-live="polite"`).
- Organization tree expand/collapse controls expose `aria-expanded` and descriptive labels.
- Reduced motion preference (`prefers-reduced-motion: reduce`) disables long transitions and animations.

---

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
  |   |-- / (LandingPage)
  |   |-- /login (PublicOnlyRoute)
  |   |-- /register (PublicOnlyRoute)
  |   |-- /unauthorized
  |   `-- * (NotFoundPage)
  `-- Protected route groups
      |-- /employee/* (EMPLOYEE)
      |-- /manager/* (MANAGER)
      |-- /admin/* (ADMIN)
      |-- /organization (Authenticated)
      `-- /shared-goals (MANAGER, ADMIN)

Feature Modules
  |-- api
  |-- hooks
  |-- components
  `-- utils

Shared Foundation
  |-- components/ui (InfoTooltip, ModalShell, Form, Surface, Badges)
  |-- lib (goal-help, datetime, utils)
  |-- services (api, endpoints, api-error, toast)
  `-- types (auth, goal)
```

---

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
      |-- bg-background / bg-card / bg-surface
      |-- text-foreground / text-muted-foreground
      |-- border-border
      `-- bg-primary / text-success / text-warning / text-destructive / text-info
```

---

## Local Setup

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm
- A running NorthStar backend API

### Install Dependencies

```bash
npm install
```

### Environment

Configure `.env` in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

The app reads `VITE_API_BASE_URL` and strips any trailing slash. If omitted, it defaults to `http://localhost:8000`.

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The build script runs TypeScript project references first, followed by the Vite production bundle:

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

---

## Deployment

This frontend is ready for static SPA hosting such as Vercel.

Deployment requirements:

- Set `VITE_API_BASE_URL` in the hosting provider environment.
- Build with `npm run build`.
- Serve the generated `dist/` output as a single-page app.
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

---

## Engineering Highlights

- **Role-aware frontend architecture:** route guards (`ProtectedRoute`, `RoleProtectedRoute`, `PublicOnlyRoute`), role home paths, role-specific sidebars, and restricted shared-goal/admin flows.
- **Self-documenting goal & measurement UI:** portal-based `InfoTooltip` (`i` button) and `src/lib/goal-help.ts` explain every goal field, UoM (`NUMERIC`, `PERCENTAGE`, `TIMELINE`, `ZERO_BASED`), measurement direction (`MIN`/`MAX`), progress formula, status badge, and timestamp across all screens and modals.
- **Enterprise UI primitives:** panels, metric tiles, modal shell, field controls, skeletons, empty/error states, status badges, dashboard header, and sidebar.
- **Semantic design system:** light/dark themes are token-driven and consumed through Tailwind CSS v4 utilities.
- **Scalable feature modules:** API, hooks, components, and utilities are colocated by domain.
- **Server-state discipline:** TanStack Query handles cache, invalidation, retry, loading, and error paths.
- **Standardized IST timestamps:** `src/lib/datetime.ts` formats all dates and relative timestamps in `Asia/Kolkata` (`IST`).
- **Chart-ready analytics layer:** admin utilities transform backend responses into Recharts-friendly view models.
- **Hierarchy visualization:** recursive organization tree supports expand/collapse, wide-team scrolling, and feeds the searchable Shared Goals employee picker.
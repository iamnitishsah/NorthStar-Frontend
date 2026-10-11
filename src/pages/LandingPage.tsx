import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Cpu,
  Database,
  FileSpreadsheet,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Users,
  Workflow,
  X,
} from "lucide-react"

import { useTheme } from "@/app/providers/use-theme"
import { useAuthStore } from "@/app/store/auth-store"
import { getRoleHomePath } from "@/app/navigation"

function NorthStarLogo() {
  return (
    <div className="northstar-mark flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-enterprise-sm">
      <img
        alt="NorthStar Logo"
        className="h-full w-full"
        src="/favicon.svg"
      />
    </div>
  )
}

function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const user = useAuthStore((state) => state.user)
  const [activeRoleTab, setActiveRoleTab] = useState<"employee" | "manager" | "admin">("employee")

  const homePath = user ? getRoleHomePath(user.role) : null

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* TOP NAVIGATION BAR                                                    */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <NorthStarLogo />
            <div>
              <span className="text-xl font-bold tracking-tight text-card-foreground">
                NorthStar
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline-block sm:ml-2 border-l border-border pl-2">
                Goal Governance Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#overview" className="transition hover:text-foreground">
              Overview
            </a>
            <a href="#business-value" className="transition hover:text-foreground">
              Business Value
            </a>
            <a href="#how-it-works" className="transition hover:text-foreground">
              Lifecycle
            </a>
            <a href="#roles" className="transition hover:text-foreground">
              Role Matrix
            </a>
            <a href="#architecture" className="transition hover:text-foreground">
              Architecture
            </a>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="theme-transition inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-enterprise-xs hover:bg-hover hover:text-foreground"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              type="button"
            >
              {theme === "dark" ? <Sun size={15} className="text-warning" /> : <Moon size={15} />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {user && homePath ? (
              <Link
                to={homePath}
                className="theme-transition inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-enterprise-xs hover:bg-primary/90"
              >
                <span>Console ({user.role})</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="theme-transition rounded-lg border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-enterprise-xs hover:bg-hover"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="theme-transition inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-enterprise-xs hover:bg-primary/90"
                >
                  <span>Register</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface/60 via-background to-background py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:w-[600px] sm:h-[600px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-enterprise-xs">
              <Sparkles size={13} className="text-primary" />
              <span>Next-Gen Enterprise Goal Lifecycle & Performance Operations</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Align Strategy. Track Execution.{" "}
              <span className="text-primary">Eliminate Spreadsheets.</span>
            </h1>

            <p className="mt-6 text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
              NorthStar transforms disconnected, spreadsheet-driven performance reviews into a live,
              role-aware digital governance portal. From strategic goal formation and managerial lockdown
              to quarterly check-ins and audit trails.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {user && homePath ? (
                <Link
                  to={homePath}
                  className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-enterprise-md hover:bg-primary/90 sm:w-auto"
                >
                  <span>Open Your Workspace</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-enterprise-md hover:bg-primary/90 sm:w-auto"
                  >
                    <span>Get Started — Self Register</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-enterprise-sm hover:bg-hover sm:w-auto"
                  >
                    <span>Sign In to Console</span>
                  </Link>
                </>
              )}
            </div>

            {/* Key stats banner */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8 sm:grid-cols-4">
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">100%</p>
                <p className="text-xs text-muted-foreground mt-1">Weightage Rigor Enforced</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">Q1–Q4</p>
                <p className="text-xs text-muted-foreground mt-1">Continuous Check-In Pulse</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">4 UoMs</p>
                <p className="text-xs text-muted-foreground mt-1">Mathematical Metric Scoring</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">Immutable</p>
                <p className="text-xs text-muted-foreground mt-1">Audit Trail & Governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* LIVE TELEMETRY SIMULATION / HERO SHOWCASE                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface/40 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="dashboard-surface overflow-hidden rounded-2xl border border-border p-6 shadow-enterprise-md sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Operational Dashboard Preview
                </span>
                <h3 className="mt-1 text-xl font-bold text-card-foreground">
                  Unified Goal Setting, Approval, & Tracking Workflow
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/12 px-3 py-1 text-xs font-semibold text-success">
                  <CheckCircle2 size={13} />
                  Status: LOCKED & Active
                </span>
                <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Weightage: 100/100%
                </span>
              </div>
            </div>

            {/* Simulated goal cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Card 1 */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-enterprise-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Revenue Growth</span>
                  <span className="font-mono font-semibold text-foreground">30% Weight</span>
                </div>
                <h4 className="mt-2 font-semibold text-card-foreground text-sm">
                  Achieve Q3 Enterprise Pipeline Target
                </h4>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">UoM: NUMERIC (MIN)</span>
                  <span className="font-mono font-semibold text-success">85% Complete</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div className="h-full bg-success rounded-full" style={{ width: "85%" }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
                  <span>Target: $500,000</span>
                  <span>Actual: $425,000</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-enterprise-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Operational Excellence</span>
                  <span className="font-mono font-semibold text-foreground">35% Weight</span>
                </div>
                <h4 className="mt-2 font-semibold text-card-foreground text-sm">
                  Reduce Service Turnaround Time (TAT)
                </h4>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">UoM: NUMERIC (MAX)</span>
                  <span className="font-mono font-semibold text-info">92% On-Track</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div className="h-full bg-info rounded-full" style={{ width: "92%" }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
                  <span>Target: 24 Hours</span>
                  <span>Actual: 26 Hours</span>
                </div>
              </div>

              {/* Card 3 - Shared Goal */}
              <div className="rounded-xl border border-primary/35 bg-card p-4 shadow-enterprise-sm relative">
                <div className="absolute top-2.5 right-2.5">
                  <span className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    SHARED KPI
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Safety & Compliance</span>
                  <span className="font-mono font-semibold text-foreground">35% Weight</span>
                </div>
                <h4 className="mt-2 font-semibold text-card-foreground text-sm pr-16">
                  Maintain Zero Critical Safety Incidents
                </h4>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">UoM: ZERO_BASED</span>
                  <span className="font-mono font-semibold text-success">100% (0 Incidents)</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div className="h-full bg-success rounded-full" style={{ width: "100%" }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
                  <span>Pushed by: Engineering VP</span>
                  <span>Synced: Across Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. PROJECT OVERVIEW                                                    */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="overview" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Core Project Concept
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              What is NorthStar?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              NorthStar is an integrated, role-governed Goal Setting & Performance Tracking Portal.
              Traditional performance reviews rely on detached spreadsheets that are filled in at the last
              minute, prone to retroactive tampering, and disconnected from high-level corporate thrust areas.
              NorthStar gives organizations an active operating console that structures the entire lifecycle of
              workforce achievement.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-enterprise-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary mb-4">
                <Target size={22} />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">
                Mathematical Weightage Discipline
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Employees cannot arbitrarily submit unbalanced goals. NorthStar enforces that the total sum of
                all goal weightages equals exactly 100%, with each goal carrying a minimum of 10% and a cap
                of 8 active goals.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-enterprise-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-success/25 bg-success/12 text-success mb-4">
                <Lock size={22} />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">
                Post-Approval Lockdown & Governance
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Once a manager signs off on goals, they transition to <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono text-foreground">LOCKED</code>.
                No employee or manager can secretly modify targets. Edits require formal Admin Unlock Requests
                with mandatory justifications and audit logs.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-enterprise-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/12 text-accent mb-4">
                <Workflow size={22} />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">
                Cascaded Shared Goals (KPIs)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Executives and Managers can broadcast organizational KPIs directly to multiple direct reports.
                Core metrics remain immutable while recipients calibrate weightage. Achievements updated by the primary
                owner sync automatically across all copies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. BUSINESS IDEA & ENTERPRISE VALUE                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="business-value" className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              The Business Problem & Enterprise ROI
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Spreadsheets Fail Enterprise Performance
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Managing workforce goals via Excel or Google Sheets incurs massive hidden costs: version chaos,
              lost historical context, zero audit trails, and subjective year-end bias. Here is how NorthStar solves it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: The Legacy Spreadsheet Pitfalls */}
            <div className="rounded-xl border border-destructive/25 bg-card p-6 sm:p-8 shadow-enterprise-sm">
              <div className="flex items-center gap-3 border-b border-destructive/15 pb-4">
                <div className="rounded-lg border border-destructive/25 bg-destructive/12 p-2 text-destructive">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">Legacy Spreadsheet Workflow</h3>
                  <p className="text-xs text-muted-foreground">Vulnerable, siloed, and error-prone</p>
                </div>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Zero Tamper Resistance:</strong> Targets and achievements can be edited days before performance reviews without any record of alterations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Subjective Math & Inconsistent Formulas:</strong> Employees invent their own formulas; MIN vs. MAX metrics are often miscalculated.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Version Proliferation:</strong> Multiple files circulating via email threads (v1_final_final.xlsx) cause massive reporting discrepancy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={18} className="text-destructive shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">No Strategic Alignment:</strong> Leadership has no bird’s-eye view of how departmental goals align with quarterly strategic thrust areas.</span>
                </li>
              </ul>
            </div>

            {/* Right: The NorthStar Operating Standard */}
            <div className="rounded-xl border border-success/25 bg-card p-6 sm:p-8 shadow-enterprise-sm">
              <div className="flex items-center gap-3 border-b border-success/20 pb-4">
                <div className="rounded-lg border border-success/25 bg-success/12 p-2 text-success">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">The NorthStar Standard</h3>
                  <p className="text-xs text-muted-foreground">Structured, auditable, and automated</p>
                </div>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Cryptographic & Audit Governance:</strong> Every action—creation, submission, approval, unlock, and check-in—is permanently recorded in audit logs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">System-Automated Progress Scoring:</strong> Strict mathematical formulas for Numeric (MIN/MAX), Percentage, Zero-Based, and Timeline goals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Single Source of Truth:</strong> Hosted API & MongoDB database with real-time org tree visualization built from live reporting links.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-success shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Real-Time Analytics & CSV Export:</strong> Admins access completion dashboards, QoQ progression trends, and one-click achievement report exports.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. WORKING & GOAL LIFECYCLE                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              System Mechanics
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              The 5-Stage Goal Lifecycle
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              How goals progress from initial draft formulation through managerial lockdown to continuous quarterly tracking.
            </p>
          </div>

          <div className="mt-14 relative">
            {/* Timeline connectors on desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
              {/* Step 1 */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary border border-primary/25 bg-primary/10 px-2 py-0.5 rounded">
                      Step 1
                    </span>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">DRAFT</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-card-foreground text-sm">
                    Creation & Alignment
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Employee defines 1 to 8 goals with thrust areas, targets, and weightages. Must balance to exactly 100% total.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] font-medium text-muted-foreground">
                  Role: Employee
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-warning border border-warning/25 bg-warning/12 px-2 py-0.5 rounded">
                      Step 2
                    </span>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">SUBMITTED</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-card-foreground text-sm">
                    Batch Submission
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    System verifies 100% total weightage and triggers an automated email notification to the assigned reporting manager.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] font-medium text-muted-foreground">
                  Role: Employee → Manager
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-info border border-info/25 bg-info/12 px-2 py-0.5 rounded">
                      Step 3
                    </span>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">REVIEW</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-card-foreground text-sm">
                    Manager Review
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Manager inspects goals. Can tweak targets inline, return for rework with notes (<code className="text-[10px] font-mono text-foreground">RETURNED</code>), or approve.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] font-medium text-muted-foreground">
                  Role: Manager
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-success border border-success/25 bg-success/12 px-2 py-0.5 rounded">
                      Step 4
                    </span>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">LOCKED</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-card-foreground text-sm">
                    Lockdown & Check-Ins
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Approved goals lock. Employees record Q1–Q4 achievements chronologically. System computes objective progress scores.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] font-medium text-muted-foreground">
                  Role: Employee & Manager
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-destructive border border-destructive/25 bg-destructive/12 px-2 py-0.5 rounded">
                      Step 5
                    </span>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">UNLOCKED?</span>
                  </div>
                  <h4 className="mt-3 font-semibold text-card-foreground text-sm">
                    Governance & Unlocks
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    If business priorities pivot, employee submits an Unlock Request. Admin reviews reason, approving or rejecting with full audit logs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] font-medium text-muted-foreground">
                  Role: Admin Governance
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Progress Computation Matrix */}
          <div className="mt-14 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-enterprise-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">
                  Automated Mathematical Progress Scoring
                </h3>
                <p className="text-xs text-muted-foreground">
                  Objective formulas eliminate guesswork during quarterly reviews
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="font-semibold text-xs text-primary">NUMERIC / PERCENTAGE (MIN)</span>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">
                  (Achievement / Target) × 100%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Higher is better. Used for Revenue, Volume, Units Sold, and CSAT scores.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="font-semibold text-xs text-primary">NUMERIC / PERCENTAGE (MAX)</span>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">
                  (Target / Achievement) × 100%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Lower is better. Used for Turnaround Time, Cloud Infrastructure Cost, and Defect Rates.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="font-semibold text-xs text-primary">ZERO_BASED</span>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">
                  Achievement == 0 ? 100% : 0%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Zero equals success. Used for Safety Incidents, Regulatory Breaches, and Sev-1 Outages.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="font-semibold text-xs text-primary">TIMELINE</span>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">
                  Date-Based Degradation
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  100% if completed on or before deadline. Proportional daily reduction for late delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. ROLE MATRIX & WORKSPACES                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="roles" className="border-b border-border bg-surface/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Role-Aware User Experience
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tailored Consoles for Every Stakeholder
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every user role enters a purpose-built workspace engineered for their operational responsibilities.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-enterprise-sm">
              <button
                type="button"
                onClick={() => setActiveRoleTab("employee")}
                className={`theme-transition rounded-lg px-5 py-2 text-sm font-semibold ${
                  activeRoleTab === "employee"
                    ? "bg-primary text-primary-foreground shadow-enterprise-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Employee Console
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab("manager")}
                className={`theme-transition rounded-lg px-5 py-2 text-sm font-semibold ${
                  activeRoleTab === "manager"
                    ? "bg-primary text-primary-foreground shadow-enterprise-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Manager Console
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab("admin")}
                className={`theme-transition rounded-lg px-5 py-2 text-sm font-semibold ${
                  activeRoleTab === "admin"
                    ? "bg-primary text-primary-foreground shadow-enterprise-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin Governance
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-8 mx-auto max-w-4xl">
            {activeRoleTab === "employee" && (
              <div className="dashboard-surface rounded-2xl border border-border p-6 sm:p-8 shadow-enterprise-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">Employee Capabilities</h3>
                    <p className="text-xs text-muted-foreground">Self-service goal ownership and achievement logging</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Create, Edit & Delete Drafts</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Formulate personal goals with custom thrust areas, targets, and weightages.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">100% Validated Batch Submission</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Submit valid sets of goals ensuring total active weightage equals exactly 100%.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Quarterly Check-In Logging</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Log sequential actual achievements for Q1, Q2, Q3, and Q4 with automatic score calculation.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Unlock Requests & Shared KPIs</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Request goal unlocking when targets shift, and manage weightages for assigned shared goals.</p>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === "manager" && (
              <div className="dashboard-surface rounded-2xl border border-border p-6 sm:p-8 shadow-enterprise-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg border border-accent/25 bg-accent/12 text-accent">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">Manager Capabilities</h3>
                    <p className="text-xs text-muted-foreground">Direct-report review, calibration, and team progress tracking</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Team Review Queue</h4>
                    <p className="mt-1 text-xs text-muted-foreground">View submitted goals organized by employee name with total weightage checks.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Approval with Inline Calibration</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Approve goals immediately, or calibrate targets and weightages inline before locking.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Return with Coaching Feedback</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Send goals back for rework with detailed explanatory notes sent via automated email.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Push Shared Goals & Quarterly Notes</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Broadcast team KPIs to multiple reports and add managerial coaching comments on check-ins.</p>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === "admin" && (
              <div className="dashboard-surface rounded-2xl border border-border p-6 sm:p-8 shadow-enterprise-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg border border-warning/25 bg-warning/12 text-warning">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">Admin Governance Capabilities</h3>
                    <p className="text-xs text-muted-foreground">Enterprise compliance, unlock arbitration, and executive analytics</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Unlock Request Arbitration</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Review, approve, or reject employee requests to unlock previously approved goals.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Direct Goal Unlocks</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Directly transition locked goals to ADMIN_UNLOCKED for mid-year reorganizations.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Executive Analytics & CSV Export</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Inspect QoQ team deltas, thrust area distributions, and export full achievement CSV reports.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="font-semibold text-sm text-foreground">Audit Logs & Organization Tree</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Search tamper-evident system logs by actor/action, and audit dynamic org reporting trees.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. ARCHITECTURE & SECURITY                                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="architecture" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Enterprise Engineering
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Architecture & Security
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Engineered with modern technologies, strict cryptographic hashing, and non-blocking background workers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
              <Cpu size={22} className="text-primary mb-3" />
              <h4 className="font-semibold text-card-foreground text-sm">FastAPI & Python 3.12</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                High-performance async ASGI gateway with Pydantic v2 validation and OpenAPI Swagger documentation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
              <Database size={22} className="text-success mb-3" />
              <h4 className="font-semibold text-card-foreground text-sm">MongoDB Motor</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Async document store with auto-indexed queries on unique employee emails, IDs, goal statuses, and audit timestamps.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
              <Mail size={22} className="text-info mb-3" />
              <h4 className="font-semibold text-card-foreground text-sm">Celery + Redis + SMTP</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Asynchronous, non-blocking email dispatching for goal submissions, approvals, and return notifications with retry policies.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
              <ShieldCheck size={22} className="text-accent mb-3" />
              <h4 className="font-semibold text-card-foreground text-sm">SHA-256 + Bcrypt + JWT</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Pre-hash encryption bypassing bcrypt 72-byte limitations, paired with stateless Bearer JWTs and role guard middleware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* CTA FOOTER BANNER                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="bg-primary/5 border-b border-border py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Transform Your Goal Management?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Experience role-governed alignment, automated quarterly scoring, and complete executive transparency today.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {user && homePath ? (
              <Link
                to={homePath}
                className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-enterprise-md hover:opacity-90 sm:w-auto"
              >
                <span>Return to Console</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-enterprise-md hover:opacity-90 sm:w-auto"
                >
                  <span>Register New Account</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="theme-transition inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-enterprise-sm hover:bg-hover sm:w-auto"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* FOOTER                                                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <footer className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <NorthStarLogo />
            <span>NorthStar &copy; {new Date().getFullYear()} — In-House Goal Setting & Tracking Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-foreground transition">
              Log In
            </Link>
            <Link to="/register" className="hover:text-foreground transition">
              Self Register
            </Link>
            <a href="#overview" className="hover:text-foreground transition">
              Overview
            </a>
            <a href="#business-value" className="hover:text-foreground transition">
              Business Value
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

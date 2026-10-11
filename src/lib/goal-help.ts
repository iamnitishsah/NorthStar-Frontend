import type {
  Goal,
  GoalStatus,
  MeasurementType,
  ProgressStatus,
  UOMType,
} from "@/types/goal"

export type GoalHelpItem = {
  label: string
  description: string
  formula?: string
  highlight?: boolean
}

export type GoalHelpContent = {
  title: string
  description: string
  formula?: string
  items?: GoalHelpItem[]
}

export const GOAL_HELP: Record<string, GoalHelpContent> = {
  goalDefinition: {
    title: "Goal Definition & Governance",
    description:
      "Every goal links a strategic Thrust Area to an objective Unit of Measure (UoM), optimization direction (MIN/MAX), target benchmark, and governance weightage.",
    items: [
      {
        label: "1 to 8 Active Goals",
        description:
          "Employees can maintain between 1 and 8 active goals (submitted + locked).",
      },
      {
        label: "100% Weightage Rule",
        description:
          "Each goal carries 10%–100% weightage, and active goals must sum to exactly 100% for submission.",
      },
    ],
  },

  thrustArea: {
    title: "Thrust Area",
    description:
      "The high-level strategic business pillar or departmental priority this goal supports (3–100 characters).",
    items: [
      {
        label: "Examples",
        description:
          "Revenue Growth, Operational Excellence, Cost Efficiency, Customer Success, Safety & Compliance.",
      },
    ],
  },

  title: {
    title: "Goal Title",
    description:
      "A concise, action-oriented commitment statement describing the specific KPI or deliverable to be achieved (3–100 characters).",
  },

  description: {
    title: "Goal Description",
    description:
      "Optional context, scope boundaries, acceptance criteria, or KPI measurement notes (up to 500 characters).",
  },

  uomType: {
    title: "Unit of Measure (UoM)",
    description:
      "Defines how the goal target and quarterly achievements are quantified and automatically scored:",
    items: [
      {
        label: "NUMERIC",
        description:
          "Count or amount metric (e.g., Revenue, Units Sold, Turnaround Time in hours). Paired with MIN or MAX.",
        formula: "MIN: (Actual / Target) × 100% | MAX: (Target / Actual) × 100%",
      },
      {
        label: "PERCENTAGE",
        description:
          "Rate or ratio metric in % (e.g., CSAT %, Conversion Rate %, Defect Rate %). Paired with MIN or MAX.",
        formula: "MIN: (Actual / Target) × 100% | MAX: (Target / Actual) × 100%",
      },
      {
        label: "TIMELINE",
        description:
          "Milestone delivery tracked against Target Date. 100% if completed on or before deadline; decreases proportionally for late delivery.",
        formula: "max(0, 100 - (Days Late / Total Days) × 100%)",
      },
      {
        label: "ZERO_BASED",
        description:
          "Binary zero-tolerance metric where 0 occurrences = 100% success (e.g., Critical Incidents, Safety Breaches). Locks Measure to MIN and Target to 1.",
        formula: "Actual == 0 ? 100% : 0%",
      },
    ],
  },

  measurementType: {
    title: "Measurement Direction (MIN vs MAX)",
    description:
      "Specifies whether higher or lower values represent better performance for NUMERIC and PERCENTAGE goals:",
    items: [
      {
        label: "MIN — Higher is Better",
        description:
          "Target is a minimum threshold to meet or exceed (e.g., Sales Revenue, Units Delivered, CSAT Score).",
        formula: "Progress = (Achievement / Target) × 100%",
      },
      {
        label: "MAX — Lower is Better",
        description:
          "Target is a maximum ceiling to stay under (e.g., Turnaround Time, Cloud Spend, Error/Defect Rate).",
        formula: "Progress = (Target / Achievement) × 100% (0 actual = 100%)",
      },
    ],
  },

  targetValue: {
    title: "Target Value",
    description:
      "The planned numeric benchmark to achieve (> 0). Combined with UoM and Measurement (MIN/MAX) to compute objective quarterly progress.",
    items: [
      {
        label: "ZERO_BASED Exception",
        description:
          "Automatically fixed to 1 during goal creation while quarterly check-ins require 0 occurrences for 100% score.",
      },
      {
        label: "Manager Calibration",
        description:
          "Reporting managers can review and calibrate the target value before locking a submitted goal.",
      },
    ],
  },

  weightage: {
    title: "Goal Weightage (%)",
    description:
      "Represents the relative priority of this goal within the employee's overall performance sheet.",
    items: [
      {
        label: "Per-Goal Range (10% – 100%)",
        description: "Every individual goal must carry at least 10% weightage.",
      },
      {
        label: "100% Total Requirement",
        description:
          "Selected goals plus already locked goals must total exactly 100% across at most 8 goals to submit.",
      },
      {
        label: "Shared Goal Customization",
        description:
          "For cascaded shared goals, weightage is the only field the recipient employee can customize.",
      },
    ],
  },

  targetDate: {
    title: "Target Date",
    description:
      "The planned completion deadline for the goal (cannot be in the past when creating or editing).",
    items: [
      {
        label: "Mandatory for TIMELINE",
        description:
          "Required when UoM is TIMELINE; used directly to calculate on-time (100%) vs. late completion scores.",
      },
      {
        label: "Optional Milestone",
        description:
          "Optional reference deadline for NUMERIC, PERCENTAGE, and ZERO_BASED goals.",
      },
    ],
  },

  submissionReadiness: {
    title: "Goal Sheet Submission Rules",
    description:
      "To submit goals for manager review, your active goal sheet (selected editable goals + already LOCKED goals) must satisfy all governance checks:",
    items: [
      {
        label: "Exact 100% Total Weightage",
        description:
          "Combined weightage of selected editable goals and locked goals must equal 100%.",
      },
      {
        label: "1 to 8 Active Goals",
        description:
          "Total active goals (selected + locked) cannot exceed 8 goals.",
      },
      {
        label: "Minimum 10% per Goal",
        description:
          "Each individual goal must have a weightage between 10% and 100%.",
      },
    ],
  },

  activeGoalsLimit: {
    title: "Active Goals Cap (Max 8)",
    description:
      "Counts currently selected editable goals plus already LOCKED goals. NorthStar caps active commitments at 8 goals per employee to maintain strategic focus.",
  },

  selectGoalForSubmission: {
    title: "Select for Batch Submission",
    description:
      "Check editable goals (DRAFT, RETURNED, or ADMIN_UNLOCKED) to include them in your submission batch. Selected goals + LOCKED goals must total 100% weightage.",
  },

  sharedGoalBadge: {
    title: "Cascaded Shared Goal (KPI)",
    description:
      "This goal was pushed by a Manager or Admin across one or more team members.",
    items: [
      {
        label: "Read-Only Core Metrics",
        description:
          "Thrust area, title, description, UoM, measurement type, target, and target date are locked to the owner's definition.",
      },
      {
        label: "Editable Weightage",
        description:
          "Recipients can adjust their individual goal weightage (10%–100%) to balance their 100% goal sheet.",
      },
      {
        label: "Synced Check-ins",
        description:
          "Quarterly achievements logged by the Primary Owner automatically sync across all locked copies.",
      },
    ],
  },

  sharedRecipients: {
    title: "Shared Goal Recipients & Primary Owner",
    description:
      "Select one or more employees to receive copies of this departmental KPI.",
    items: [
      {
        label: "Primary Owner (First Selected)",
        description:
          "The first selected employee becomes the Primary Owner. When they log a quarterly check-in, progress syncs to all other locked copies.",
      },
      {
        label: "Recipient Copies",
        description:
          "Each recipient receives a linked goal copy where only weightage can be adjusted.",
      },
    ],
  },

  quarterlyProgressSection: {
    title: "Quarterly Progress Tracking (Q1–Q4)",
    description:
      "Tracks execution across Q1, Q2, Q3, and Q4 once a goal is LOCKED. Check-ins are recorded sequentially one quarter at a time.",
    items: [
      {
        label: "Carry-Forward Display",
        description:
          "Quarters without a direct check-in display the most recent prior quarter's achievement and progress.",
      },
      {
        label: "Objective Scoring",
        description:
          "Progress % is computed automatically by the system from Achievement vs. Target using the goal's UoM and MIN/MAX rule.",
      },
    ],
  },

  quarterSequence: {
    title: "Sequential Quarter Check-in",
    description:
      "Quarterly check-ins are unlocked and submitted strictly in chronological order (Q1 → Q2 → Q3 → Q4) on LOCKED goals.",
  },

  progressStatus: {
    title: "Quarterly Progress Status",
    description:
      "Self-reported execution status for the quarter alongside the numeric or date achievement:",
    items: [
      {
        label: "NOT_STARTED",
        description: "Work on this quarter's milestone has not yet begun.",
      },
      {
        label: "ON_TRACK",
        description: "Execution is actively progressing toward the target.",
      },
      {
        label: "COMPLETED",
        description: "Target deliverable or milestone for the quarter is complete.",
      },
    ],
  },

  unlockReason: {
    title: "Admin Unlock Request Governance",
    description:
      "LOCKED goals are immutable to prevent unapproved target changes. Provide a clear business justification (5–500 characters) for an Admin to review and unlock the goal.",
  },

  managerCalibration: {
    title: "Manager Approval & Inline Calibration",
    description:
      "Before locking a submitted goal, managers can fine-tune the Target Value or Weightage (10%–100%). Once approved, the goal transitions to LOCKED.",
  },

  managerReturnNote: {
    title: "Return for Rework (RETURNED)",
    description:
      "Returning a goal moves its status to RETURNED and sends your coaching note to the employee so they can revise and resubmit.",
  },

  managerQuarterlyComment: {
    title: "Manager Quarterly Coaching Note",
    description:
      "Adds a review comment directly onto the selected quarter's check-in tile for employee feedback and audit history.",
  },

  createdTimestamp: {
    title: "Created Timestamp (IST)",
    description:
      "Date and time when this goal was initially created. For TIMELINE goals, the span from Creation Date to Target Date defines Total Days in late-delivery scoring.",
  },

  submittedTimestamp: {
    title: "Submitted Timestamp (IST)",
    description:
      "Date and time when the employee submitted this goal into the manager review queue.",
  },

  approvedTimestamp: {
    title: "Approved Timestamp (IST)",
    description:
      "Date and time when the reporting manager approved and locked this goal for quarterly execution.",
  },

  returnedTimestamp: {
    title: "Returned Timestamp (IST)",
    description:
      "Date and time when the reporting manager returned this goal with feedback notes for rework.",
  },

  updatedTimestamp: {
    title: "Last Updated Timestamp (IST)",
    description:
      "Date and time of the most recent modification, status transition, or quarterly check-in on this goal.",
  },

  goalId: {
    title: "Unique Goal Identifier",
    description:
      "System-generated immutable identifier used in audit logs, manager reviews, and admin unlock governance.",
  },
}

export function getUomFieldHelp(selectedUom?: UOMType): GoalHelpContent {
  return {
    title: selectedUom
      ? `Unit of Measure (UoM · ${selectedUom})`
      : GOAL_HELP.uomType.title,
    description: GOAL_HELP.uomType.description,
    items: GOAL_HELP.uomType.items?.map((item) => ({
      ...item,
      highlight: item.label === selectedUom,
    })),
  }
}

export function getUomHelp(uomType: UOMType): GoalHelpContent {
  switch (uomType) {
    case "NUMERIC":
      return {
        title: "UoM: NUMERIC",
        description:
          "Quantifies performance as a raw number, count, or currency amount (e.g., Revenue, Units Sold, Turnaround Hours).",
        items: [
          {
            label: "With MIN (Higher is Better)",
            description: "Target is a minimum floor to reach or exceed.",
            formula: "Progress = (Achievement / Target) × 100%",
          },
          {
            label: "With MAX (Lower is Better)",
            description: "Target is a maximum ceiling to stay below.",
            formula: "Progress = (Target / Achievement) × 100%",
          },
        ],
      }
    case "PERCENTAGE":
      return {
        title: "UoM: PERCENTAGE (%)",
        description:
          "Quantifies performance as a percentage rate or ratio (e.g., CSAT Score %, Conversion Rate %, Uptime %, Defect Rate %).",
        items: [
          {
            label: "With MIN (Higher is Better)",
            description: "Higher percentage achieved increases progress.",
            formula: "Progress = (Achievement % / Target %) × 100%",
          },
          {
            label: "With MAX (Lower is Better)",
            description: "Lower percentage achieved increases progress.",
            formula: "Progress = (Target % / Achievement %) × 100%",
          },
        ],
      }
    case "TIMELINE":
      return {
        title: "UoM: TIMELINE (Date-Based)",
        description:
          "Evaluates milestone delivery by comparing the actual Achievement Date against the planned Target Date.",
        formula:
          "On/Before Target Date = 100% | Late = max(0, 100 - (Days Late / Total Days) × 100%)",
        items: [
          {
            label: "On-Time Delivery",
            description:
              "Completing on or before the Target Date yields 100% progress.",
          },
          {
            label: "Late Delivery Degradation",
            description:
              "Each day past the Target Date reduces progress proportionally over the goal's total planned duration.",
          },
        ],
      }
    case "ZERO_BASED":
      return {
        title: "UoM: ZERO_BASED (Zero = Success)",
        description:
          "Binary zero-tolerance metric where 0 occurrences is required for 100% success (e.g., Safety Incidents, Critical Outages, Compliance Breaches).",
        formula: "Achievement == 0 → 100% | Achievement > 0 → 0%",
        items: [
          {
            label: "0 Occurrences",
            description: "Achieves 100% score for the quarter.",
          },
          {
            label: "1 or More Occurrences",
            description: "Drops quarterly progress score to 0%.",
          },
        ],
      }
  }
}

export function getMeasurementHelp(
  measurementType: MeasurementType,
  uomType?: UOMType
): GoalHelpContent {
  if (uomType === "ZERO_BASED") {
    return {
      title: "Measurement: ZERO_BASED (MIN)",
      description:
        "ZERO_BASED goals automatically lock Measurement to MIN with a binary zero-occurrence rule.",
      formula: "Achievement == 0 → 100% | Achievement > 0 → 0%",
    }
  }

  if (uomType === "TIMELINE") {
    return {
      title: `Measurement: ${measurementType} (Timeline Goal)`,
      description:
        "For TIMELINE goals, progress is scored by comparing the quarterly Achievement Date against the Target Date deadline.",
      formula:
        "On/Before Target Date = 100% | Late = max(0, 100 - (Days Late / Total Days) × 100%)",
    }
  }

  if (measurementType === "MIN") {
    return {
      title: "Measurement: MIN (Higher is Better)",
      description:
        "The Target Value is a minimum threshold to meet or exceed (e.g., Revenue, Output Volume, CSAT Score). Higher actual achievement produces a higher progress percentage.",
      formula: "Progress = (Achievement / Target) × 100%",
      items: [
        {
          label: "MIN (Current — Higher is Better)",
          description: "Exceeding the target yields 100%+ progress.",
          formula: "(Achievement / Target) × 100%",
          highlight: true,
        },
        {
          label: "MAX (Lower is Better)",
          description: "Used when staying below a ceiling is desired.",
          formula: "(Target / Achievement) × 100%",
        },
      ],
    }
  }

  return {
    title: "Measurement: MAX (Lower is Better)",
    description:
      "The Target Value is a maximum ceiling to stay under (e.g., Turnaround Time, Infrastructure Cost, Defect Rate). Lower actual achievement produces a higher progress percentage.",
    formula: "Progress = (Target / Achievement) × 100% (0 actual = 100%)",
    items: [
      {
        label: "MAX (Current — Lower is Better)",
        description: "Keeping actuals at or below target yields 100% progress.",
        formula: "(Target / Achievement) × 100%",
        highlight: true,
      },
      {
        label: "MIN (Higher is Better)",
        description: "Used when reaching or exceeding a minimum floor is desired.",
        formula: "(Achievement / Target) × 100%",
      },
    ],
  }
}

export function getGoalTargetHelp(goal: Pick<Goal, "uom_type" | "measurement_type" | "target_value" | "target_date">): GoalHelpContent {
  const uomHelp = getUomHelp(goal.uom_type)
  const measureHelp = getMeasurementHelp(goal.measurement_type, goal.uom_type)

  return {
    title: `Target & Measurement (${goal.uom_type} · ${goal.measurement_type})`,
    description: `${uomHelp.description} ${measureHelp.description}`,
    formula: measureHelp.formula || uomHelp.formula,
    items: [
      {
        label: `Planned Target: ${goal.target_value} (${goal.uom_type})`,
        description:
          goal.uom_type === "ZERO_BASED"
            ? "Benchmark fixed at 1 on creation; check-in requires 0 occurrences for 100% score."
            : goal.uom_type === "TIMELINE"
              ? `Milestone tracked against target deadline${goal.target_date ? ` (${goal.target_date.slice(0, 10)})` : ""}.`
              : goal.measurement_type === "MIN"
                ? "Minimum threshold to meet or exceed (higher actuals increase progress)."
                : "Maximum ceiling to stay under (lower actuals increase progress).",
      },
    ],
  }
}

export function getGoalStatusHelp(status: GoalStatus): GoalHelpContent {
  const statusDescriptions: Record<GoalStatus, string> = {
    DRAFT:
      "Goal is in draft state. You can freely edit details, delete it, or select it for batch submission once active goals total 100% weightage.",
    SUBMITTED:
      "Goal has been submitted to your reporting manager for review. Editing is locked while awaiting approval or return.",
    LOCKED:
      "Goal has been approved by your manager and locked for governance. You can now log sequential Q1–Q4 check-ins. Modifying target details requires an Admin Unlock Request.",
    RETURNED:
      "Goal was returned by your manager with feedback notes. Edit the goal to address the feedback and resubmit.",
    ADMIN_UNLOCKED:
      "An Admin unlocked this previously locked goal. You can now update its fields and resubmit for manager approval.",
  }

  return {
    title: `Goal Status: ${status}`,
    description: statusDescriptions[status],
  }
}

export function getCheckinAchievementHelp(
  goal: Pick<Goal, "uom_type" | "measurement_type" | "target_value" | "target_date">
): GoalHelpContent {
  if (goal.uom_type === "TIMELINE") {
    return {
      title: "Quarterly Achievement Date (TIMELINE)",
      description:
        "Select the actual completion date for this milestone. Completing on or before the Target Date scores 100%; late dates reduce the score proportionally.",
      formula:
        "On/Before Target Date = 100% | Late = max(0, 100 - (Days Late / Total Days) × 100%)",
    }
  }

  if (goal.uom_type === "ZERO_BASED") {
    return {
      title: "Quarterly Achievement Value (ZERO_BASED)",
      description:
        "Enter the count of occurrences/incidents in this quarter (must be ≥ 0). Entering 0 yields 100% progress; any number greater than 0 yields 0%.",
      formula: "Achievement == 0 → 100% | Achievement > 0 → 0%",
    }
  }

  if (goal.measurement_type === "MAX") {
    return {
      title: `Quarterly Achievement (${goal.uom_type} · MAX — Lower is Better)`,
      description: `Enter the actual value achieved this quarter (> 0). Because Measurement is MAX, staying at or below the target (${goal.target_value}) yields higher progress.`,
      formula: `Progress = (${goal.target_value} / Achievement) × 100%`,
    }
  }

  return {
    title: `Quarterly Achievement (${goal.uom_type} · MIN — Higher is Better)`,
    description: `Enter the actual value achieved this quarter (> 0). Because Measurement is MIN, reaching or exceeding the target (${goal.target_value}) yields higher progress.`,
    formula: `Progress = (Achievement / ${goal.target_value}) × 100%`,
  }
}

export function getProgressStatusBadgeHelp(status?: ProgressStatus | string): GoalHelpContent {
  if (status === "COMPLETED") {
    return {
      title: "Quarter Status: COMPLETED",
      description:
        "The employee reported this quarter's milestone or target deliverable as completed.",
    }
  }
  if (status === "ON_TRACK") {
    return {
      title: "Quarter Status: ON_TRACK",
      description:
        "The employee reported active, on-track execution for this quarter.",
    }
  }
  if (status === "NOT_STARTED") {
    return {
      title: "Quarter Status: NOT_STARTED",
      description:
        "Check-in recorded with execution marked as not yet started for this quarter.",
    }
  }
  return {
    title: "Quarter Status: PENDING",
    description:
      "No check-in has been submitted for this quarter yet. If earlier quarters have check-ins, their latest achievement and progress are carried forward.",
  }
}


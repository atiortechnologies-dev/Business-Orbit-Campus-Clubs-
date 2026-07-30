/**
 * @file stageDefinitions.js
 * @description Defines the static template for startup stages.
 * @architecture An array of stage objects used to initialize a startup's journey when their account is created.
 */

const STAGE_DEFINITIONS = [
  {
    stage_number: 1,
    stage_name: "Ideation",
    instructions:
      "Define your core value proposition, refine your problem statement, and analyze the market demand for your proposed solution.",
    objectives: [
      "Formulate a clear problem & solution hypothesis",
      "Identify target customer personas and demographics",
      "Conduct preliminary competitive analysis",
    ],
    deliverables: [
      "Problem Statement Pitch Deck Slide",
      "Lean Canvas Overview Document",
      "Initial User Interview Questionnaire",
    ],
    estimated_timeline_days: 14,
  },
  {
    stage_number: 2,
    stage_name: "Validation",
    instructions:
      "Validate your product hypothesis through direct market research, customer interviews, and willingness-to-pay testing.",
    objectives: [
      "Conduct at least 15 target customer interviews",
      "Validate willingness-to-pay or initial user demand",
      "Establish primary value metrics and unit economics assumptions",
    ],
    deliverables: [
      "Customer Interview Summary Report",
      "Competitor Matrix",
      "Landing Page / Waitlist Conversion Report",
    ],
    estimated_timeline_days: 30,
  },
  {
    stage_number: 3,
    stage_name: "MVP",
    instructions:
      "Build and deploy a Minimum Viable Product (MVP) containing core functionality needed to test with real users.",
    objectives: [
      "Design wireframes and user journey maps",
      "Develop functional V1 MVP or prototype",
      "Onboard initial pilot testers or beta users",
    ],
    deliverables: [
      "Figma Prototype or Live Product Link",
      "Technical Architecture Diagram",
      "Beta Testing Feedback Log",
    ],
    estimated_timeline_days: 45,
  },
  {
    stage_number: 4,
    stage_name: "Traction",
    instructions:
      "Grow your active user base, optimize key operational funnel metrics, and generate initial revenue or engagement proof.",
    objectives: [
      "Drive weekly active user (WAU) or customer growth",
      "Optimize customer retention and churn rates",
      "Secure early revenue, pre-orders, or formal LOIs",
    ],
    deliverables: [
      "User Retention & Growth Analytics Report",
      "Financial Projections & Cash Flow Model",
      "Customer Testimonials & Case Studies",
    ],
    estimated_timeline_days: 60,
  },
  {
    stage_number: 5,
    stage_name: "Launch & Pitch",
    instructions:
      "Prepare your startup for ecosystem graduation, investor pitch presentations, and institutional incubation applications.",
    objectives: [
      "Finalize investor pitch deck and executive summary",
      "Prepare for BOCC Demo Day and investor Q&A",
      "Apply to partner incubators and seed funds",
    ],
    deliverables: [
      "Final 10-Slide Investor Deck",
      "2-Minute Video Product Demo",
      "Cap Table & Legal Structure Document",
    ],
    estimated_timeline_days: 30,
  },
];

module.exports = { STAGE_DEFINITIONS };

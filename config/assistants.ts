// Specialist assistants shown in the left navigation.
//
// All assistants use the same Dify app. The selected assistant is sent to Dify
// as the conversation input variable `assistant_mode` (one of the ids below).
// To make the modes behave differently, add a variable named `assistant_mode`
// to the Dify app (Text input, not required) and reference {{assistant_mode}}
// in its system prompt. Dify fixes inputs when a conversation starts, so
// switching assistant always opens a new conversation.

export const ASSISTANT_MODE_VAR = 'assistant_mode'

export type AssistantId = 'sac' | 'datasphere' | 'hana' | 'interview_prep'

export interface Assistant {
  id: AssistantId
  name: string
  tagline: string
  description: string
  prompts: string[]
}

export const ASSISTANTS: Assistant[] = [
  {
    id: 'sac',
    name: 'SAC Assistant',
    tagline: 'Stories, models & planning',
    description: 'Build stories, design models, write planning logic and scripts in SAP Analytics Cloud.',
    prompts: [
      'How do I create a calculated measure for YoY growth in an SAC story?',
      'Explain the difference between a planning model and an analytic model.',
      'Write an SAC data action to copy actuals into the forecast version.',
      'Best practices to improve SAC story performance with large datasets?',
    ],
  },
  {
    id: 'datasphere',
    name: 'Datasphere Assistant',
    tagline: 'Modeling, spaces & integration',
    description: 'Design views, analytic models, data flows and connections in SAP Datasphere.',
    prompts: [
      'When should I use a graphical view versus an SQL view in Datasphere?',
      'How do I build an Analytic Model on top of a fact view with associations?',
      'Explain replication flows vs data flows vs transformation flows.',
      'How do I expose a Datasphere model to SAP Analytics Cloud?',
    ],
  },
  {
    id: 'hana',
    name: 'HANA Assistant',
    tagline: 'SQL, SQLScript & performance',
    description: 'Write and tune SQL, SQLScript, calculation views and procedures on SAP HANA.',
    prompts: [
      'Write a SQLScript procedure that loads data incrementally using a watermark.',
      'How do I analyze a slow query with PlanViz in SAP HANA?',
      'Explain column store vs row store and when to use each.',
      'Convert this window function logic into an efficient HANA SQL query.',
    ],
  },
  {
    id: 'interview_prep',
    name: 'Interview Prep',
    tagline: 'Mock interviews & feedback',
    description: 'Practice SAP analytics interviews with realistic questions and feedback on your answers.',
    prompts: [
      'Run a mock interview for an SAP SAC consultant role, one question at a time.',
      'Ask me 5 scenario-based SAP Datasphere interview questions.',
      'What are the most common SAP HANA modeling interview questions?',
      'How should I explain an end-to-end SAC implementation project in an interview?',
    ],
  },
]

export const DEFAULT_ASSISTANT_ID: AssistantId = 'sac'

export const getAssistant = (id?: string | null): Assistant =>
  ASSISTANTS.find(a => a.id === id) || ASSISTANTS.find(a => a.id === DEFAULT_ASSISTANT_ID)!

export const isAssistantId = (id: unknown): id is AssistantId =>
  typeof id === 'string' && ASSISTANTS.some(a => a.id === id)

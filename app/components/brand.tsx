import type { FC } from 'react'
import React from 'react'
import {
  RiBarChartBoxLine,
  RiDatabase2Line,
  RiGraduationCapLine,
  RiStackLine,
} from '@remixicon/react'
import type { AssistantId } from '@/config/assistants'
import cn from '@/utils/classnames'

/** Brand mark: ascending analytics bars with an AI spark. Same artwork as public/brand/logo-mark.svg. */
export const LogoMark: FC<{ className?: string }> = ({ className }) => {
  const id = React.useId()
  return (
    <svg viewBox="0 0 64 64" className={cn('h-8 w-8 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1B90FF" />
          <stop offset="1" stopColor="#0040B0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${id})`} />
      <path d="M12 50.5h40" stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="14" y="36" width="8" height="11" rx="2.5" fill="#fff" fillOpacity=".7" />
      <rect x="26" y="28" width="8" height="19" rx="2.5" fill="#fff" fillOpacity=".85" />
      <rect x="38" y="20" width="8" height="27" rx="2.5" fill="#fff" />
      <path d="M49 7.5c.6 4.1 2.4 5.9 6.5 6.5-4.1.6-5.9 2.4-6.5 6.5-.6-4.1-2.4-5.9-6.5-6.5 4.1-.6 5.9-2.4 6.5-6.5Z" fill="#FFC933" />
    </svg>
  )
}

export const Wordmark: FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
    <LogoMark />
    <div className="min-w-0 leading-tight">
      <div className="text-[15px] font-semibold text-gray-900 truncate">SAC Copilot</div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">for SAP Analytics</div>
    </div>
  </div>
)

const ASSISTANT_ICONS: Record<AssistantId, typeof RiBarChartBoxLine> = {
  sac: RiBarChartBoxLine,
  datasphere: RiStackLine,
  hana: RiDatabase2Line,
  interview_prep: RiGraduationCapLine,
}

// Full class strings so Tailwind can see them.
const ASSISTANT_TONES: Record<AssistantId, string> = {
  sac: 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300',
  datasphere: 'bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300',
  hana: 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300',
  interview_prep: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
}

export const AssistantIcon: FC<{ id: AssistantId, size?: 'sm' | 'md' | 'lg', className?: string }> = ({ id, size = 'md', className }) => {
  const Icon = ASSISTANT_ICONS[id]
  const box = { sm: 'h-6 w-6 rounded-md', md: 'h-8 w-8 rounded-lg', lg: 'h-10 w-10 rounded-xl' }[size]
  const icon = { sm: 'h-3.5 w-3.5', md: 'h-[18px] w-[18px]', lg: 'h-5 w-5' }[size]
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', box, ASSISTANT_TONES[id], className)}>
      <Icon className={icon} />
    </span>
  )
}

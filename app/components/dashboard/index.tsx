'use client'
import type { FC } from 'react'
import React from 'react'
import { RiArrowRightUpLine, RiChat3Line, RiSparkling2Line } from '@remixicon/react'
import type { ConversationItem } from '@/types/app'
import type { Assistant, AssistantId } from '@/config/assistants'
import { ASSISTANTS, ASSISTANT_MODE_VAR, isAssistantId } from '@/config/assistants'
import { AssistantIcon, LogoMark } from '@/app/components/brand'
import cn from '@/utils/classnames'

export interface IDashboardProps {
  assistant: Assistant
  conversations: ConversationItem[]
  onAssistantChange: (id: AssistantId) => void
  onPromptSelect: (prompt: string) => void
  onConversationSelect: (id: string) => void
}

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) { return 'Good morning' }
  if (hour < 17) { return 'Good afternoon' }
  return 'Good evening'
}

const Dashboard: FC<IDashboardProps> = ({
  assistant,
  conversations,
  onAssistantChange,
  onPromptSelect,
  onConversationSelect,
}) => {
  const recent = conversations.filter(item => item.id !== '-1').slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 tablet:px-6 tablet:pt-8 pc:pt-12">
      {/* Hero */}
      <section className="flex flex-col items-start gap-4 tablet:flex-row tablet:items-center">
        <LogoMark className="h-10 w-10 tablet:h-12 tablet:w-12" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 tablet:text-[28px]">{greeting()}. How can I help with SAP today?</h1>
          <p className="mt-1 text-sm text-gray-500">Pick a specialist assistant, choose a starter question or type your own below.</p>
        </div>
      </section>

      {/* Assistants */}
      <section className="mt-6 tablet:mt-8" aria-label="Assistants">
        <div className="grid grid-cols-2 gap-2.5 tablet:gap-3 pc:grid-cols-4">
          {ASSISTANTS.map((item) => {
            const isActive = item.id === assistant.id
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onAssistantChange(item.id)}
                aria-pressed={isActive}
                className={cn(
                  'group flex flex-col items-start rounded-xl border bg-surface p-3 text-left tablet:p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-composer',
                  isActive ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-line hover:border-gray-300',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <AssistantIcon id={item.id} size="lg" />
                  {isActive && <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">Active</span>}
                </div>
                <div className="mt-3 text-sm font-semibold text-gray-900">{item.name}</div>
                <div className="mt-1 text-xs leading-relaxed text-gray-500 tablet:hidden">{item.tagline}</div>
                <div className="mt-1 hidden text-xs leading-relaxed text-gray-500 tablet:block">{item.description}</div>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 pc:grid-cols-3">
        {/* Starter prompts */}
        <section className="pc:col-span-2" aria-label="Starter questions">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <RiSparkling2Line className="h-4 w-4 text-primary-600" />
            Starter questions for {assistant.name}
          </h2>
          <div className="grid grid-cols-1 gap-2.5 tablet:grid-cols-2">
            {assistant.prompts.map(prompt => (
              <button
                type="button"
                key={prompt}
                onClick={() => onPromptSelect(prompt)}
                className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-3.5 text-left text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50/60"
              >
                <span>{prompt}</span>
                <RiArrowRightUpLine className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-primary-600" />
              </button>
            ))}
          </div>
        </section>

        {/* Recent conversations */}
        <section aria-label="Recent conversations">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Recent conversations</h2>
          <div className="rounded-xl border border-line bg-surface p-1.5 shadow-card">
            {recent.length === 0
              ? <div className="px-3 py-6 text-center text-xs text-gray-400">Your conversations will appear here.</div>
              : recent.map((item) => {
                const mode = item.inputs?.[ASSISTANT_MODE_VAR]
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onConversationSelect(item.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {isAssistantId(mode)
                      ? <AssistantIcon id={mode} size="sm" />
                      : <RiChat3Line className="h-4 w-4 shrink-0 text-gray-400" />}
                    <span className="truncate">{item.name}</span>
                  </button>
                )
              })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default React.memo(Dashboard)

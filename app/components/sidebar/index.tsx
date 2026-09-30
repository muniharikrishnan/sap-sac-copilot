import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddLine, RiChat3Line, RiCloseLine } from '@remixicon/react'
import type { ConversationItem } from '@/types/app'
import type { AssistantId } from '@/config/assistants'
import { ASSISTANTS, ASSISTANT_MODE_VAR, isAssistantId } from '@/config/assistants'
import { AssistantIcon, Wordmark } from '@/app/components/brand'
import cn from '@/utils/classnames'

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  activeAssistant: AssistantId
  onAssistantChange: (id: AssistantId) => void
  onClose?: () => void
}

const SectionTitle: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{children}</div>
)

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  activeAssistant,
  onAssistantChange,
  onClose,
}) => {
  const { t } = useTranslation()
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <Wordmark />
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
            <RiCloseLine className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={() => onCurrentIdChange('-1')}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 text-sm font-medium text-white shadow-card transition-colors hover:bg-primary-700 dark:hover:bg-primary-500"
        >
          <RiAddLine className="h-4 w-4" />
          {t('app.chat.newChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <SectionTitle>Assistants</SectionTitle>
        <nav className="space-y-0.5" aria-label="Assistants">
          {ASSISTANTS.map((assistant) => {
            const isActive = assistant.id === activeAssistant
            return (
              <button
                type="button"
                key={assistant.id}
                onClick={() => onAssistantChange(assistant.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors',
                  isActive ? 'bg-primary-50 ring-1 ring-inset ring-primary-100' : 'hover:bg-gray-50',
                )}
              >
                <AssistantIcon id={assistant.id} />
                <span className="min-w-0">
                  <span className={cn('block truncate text-sm font-medium', isActive ? 'text-primary-700' : 'text-gray-800')}>{assistant.name}</span>
                  <span className="block truncate text-xs text-gray-500">{assistant.tagline}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <SectionTitle>Recent chats</SectionTitle>
        {list.length === 0
          ? <div className="px-3 py-2 text-xs text-gray-400">No conversations yet</div>
          : (
            <nav className="space-y-0.5" aria-label="Conversations">
              {list.map((item) => {
                const isCurrent = item.id === currentId
                const mode = item.inputs?.[ASSISTANT_MODE_VAR]
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onCurrentIdChange(item.id)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      isCurrent ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                  >
                    {isAssistantId(mode)
                      ? <AssistantIcon id={mode} size="sm" />
                      : <RiChat3Line className="h-4 w-4 shrink-0 text-gray-400" />}
                    <span className="truncate">{item.name}</span>
                  </button>
                )
              })}
            </nav>
          )}
      </div>

      <div className="shrink-0 border-t border-line px-4 py-3 text-[11px] leading-relaxed text-gray-400">
        <div>© {(new Date()).getFullYear()} {copyRight}</div>
        <div>Independent tool. Not affiliated with or endorsed by SAP SE.</div>
      </div>
    </aside>
  )
}

export default React.memo(Sidebar)

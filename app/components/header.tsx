import type { FC } from 'react'
import React from 'react'
import { RiEditBoxLine, RiMenuLine } from '@remixicon/react'
import ThemeToggle from '@/app/components/theme-toggle'
import { AssistantIcon } from '@/app/components/brand'
import type { Assistant } from '@/config/assistants'

export interface IHeaderProps {
  title: string
  assistant: Assistant
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900'

const Header: FC<IHeaderProps> = ({
  title,
  assistant,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface/80 px-3 backdrop-blur tablet:px-5">
      {isMobile && (
        <button type="button" className={iconBtn} onClick={() => onShowSideBar?.()} aria-label="Open menu">
          <RiMenuLine className="h-5 w-5" />
        </button>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <AssistantIcon id={assistant.id} size="md" />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-semibold text-gray-900">{assistant.name}</div>
          <div className="truncate text-xs text-gray-500">{title}</div>
        </div>
      </div>
      <ThemeToggle />
      <button type="button" className={iconBtn} onClick={() => onCreateNewChat?.()} aria-label="New chat" title="New chat">
        <RiEditBoxLine className="h-[18px] w-[18px]" />
      </button>
    </header>
  )
}

export default React.memo(Header)

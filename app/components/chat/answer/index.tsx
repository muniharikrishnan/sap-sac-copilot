'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { RiCheckLine, RiFileCopyLine, RiThumbDownFill, RiThumbDownLine, RiThumbUpFill, RiThumbUpLine } from '@remixicon/react'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { LogoMark } from '@/app/components/brand'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import Thought from '../thought'

const ActionBtn: FC<{ label: string, active?: boolean, onClick?: () => void, children: React.ReactNode }> = ({ label, active, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active}
    onClick={onClick}
    className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${active ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
  >
    {children}
  </button>
)

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

// The component needs to maintain its own state to control whether to display input component
const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [] } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  const { t } = useTranslation()

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    const text = isAgentMode ? (agent_thoughts || []).map(item => item.thought).filter(Boolean).join('\n\n') : content
    copy(text || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rating = feedback?.rating
  const renderActions = () => (
    <div className="mt-1 flex items-center gap-0.5">
      <ActionBtn label={copied ? 'Copied' : 'Copy'} onClick={handleCopy}>
        {copied ? <RiCheckLine className="h-4 w-4" /> : <RiFileCopyLine className="h-4 w-4" />}
      </ActionBtn>
      {!feedbackDisabled && !item.feedbackDisabled && (
        <>
          {rating !== 'dislike' && (
            <ActionBtn
              label={rating === 'like' ? 'Remove like' : t('common.operation.like') as string}
              active={rating === 'like'}
              onClick={() => onFeedback?.(id, { rating: rating === 'like' ? null : 'like' })}
            >
              {rating === 'like' ? <RiThumbUpFill className="h-4 w-4" /> : <RiThumbUpLine className="h-4 w-4" />}
            </ActionBtn>
          )}
          {rating !== 'like' && (
            <ActionBtn
              label={rating === 'dislike' ? 'Remove dislike' : t('common.operation.dislike') as string}
              active={rating === 'dislike'}
              onClick={() => onFeedback?.(id, { rating: rating === 'dislike' ? null : 'dislike' })}
            >
              {rating === 'dislike' ? <RiThumbDownFill className="h-4 w-4" /> : <RiThumbDownLine className="h-4 w-4" />}
            </ActionBtn>
          )}
        </>
      )}
    </div>
  )

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (
            <StreamdownMarkdown content={item.thought} />
          )}
          {/* {item.tool} */}
          {/* perhaps not use tool */}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  const isWaiting = isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content)

  return (
    <div key={id} className="group flex items-start gap-3">
      <div className="relative mt-0.5">
        <LogoMark className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-[15px] leading-relaxed text-gray-900 ${workflowProcess ? 'tablet:min-w-[480px]' : ''}`}>
          {workflowProcess && (
            <WorkflowProcess data={workflowProcess} hideInfo />
          )}
          {isWaiting
            ? (
              <div className="flex h-7 items-center">
                <LoadingAnim type="text" />
              </div>
            )
            : (isAgentMode
              ? agentModeAnswer
              : (
                <StreamdownMarkdown content={content} />
              ))}
          {suggestedQuestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((suggestion, index) => (
                <Button key={index} className="!h-auto !py-1.5 text-sm" type="link" onClick={() => suggestionClick(suggestion)}>{suggestion}</Button>
              ))}
            </div>
          )}
        </div>
        {!isResponding && !isWaiting && (content || isAgentMode) && renderActions()}
      </div>
    </div>
  )
}
export default React.memo(Answer)

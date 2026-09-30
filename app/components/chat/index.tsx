'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import { RiArrowUpLine } from '@remixicon/react'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
  /**
   * Rendered instead of the message list (e.g. the dashboard for a new chat)
   */
  emptyState?: React.ReactNode
  placeholder?: string
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
  emptyState,
  placeholder,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const hasPendingImageUploads = files.some(file => file.progress !== -1 && file.progress < 100)
    const hasPendingAttachmentUploads = attachmentFiles.some(file => file.progress !== -1 && file.progress < 100)
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  const canSend = query.trim().length > 0 && !isResponding

  return (
    <div className="h-full">
      {/* Chat List */}
      {emptyState || (
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pt-6 tablet:px-6">
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
              />
            )
          })}
        </div>
      )}
      {
        !isHideSendInput && (
          // Positioned against the chat column (not the scroll area) so it stays pinned at the bottom.
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-canvas via-canvas to-canvas/0 px-3 pb-3 pt-6 tablet:px-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="relative rounded-2xl border border-line bg-surface p-2 shadow-composer transition-colors focus-within:border-primary-400">
                <div className="max-h-[200px] overflow-y-auto">
                  {
                    visionConfig?.enabled && (
                      <div className="pl-[44px]">
                        <ImageList
                          list={files}
                          onRemove={onRemove}
                          onReUpload={onReUpload}
                          onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                          onImageLinkLoadError={onImageLinkLoadError}
                        />
                      </div>
                    )
                  }
                  {
                    fileConfig?.enabled && (
                      <div className={`${visionConfig?.enabled ? 'pl-[44px]' : ''} mb-1`}>
                        <FileUploaderInAttachmentWrapper
                          fileConfig={fileConfig}
                          value={attachmentFiles}
                          onChange={setAttachmentFiles}
                        />
                      </div>
                    )
                  }
                  <Textarea
                    className={cn(
                      'block w-full resize-none appearance-none bg-transparent py-2 pl-2 pr-12 text-[15px] leading-6 text-gray-900 outline-none placeholder:text-gray-400',
                      visionConfig?.enabled && 'pl-11',
                    )}
                    value={query}
                    placeholder={placeholder}
                    onChange={handleContentChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    autoSize={{ minRows: 1, maxRows: 8 }}
                  />
                </div>
                {
                  visionConfig?.enabled && (
                    <div className="absolute bottom-3 left-3 flex items-center">
                      <ChatImageUploader
                        settings={visionConfig}
                        onUpload={onUpload}
                        disabled={files.length >= visionConfig.number_limits}
                      />
                    </div>
                  )
                }
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  aria-label={t('common.operation.send') as string}
                  title={`${t('common.operation.send')} (Enter) · ${t('common.operation.lineBreak')} (Shift + Enter)`}
                  className={cn(
                    'absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                    canSend ? 'bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500' : 'cursor-not-allowed bg-gray-100 text-gray-400',
                  )}
                >
                  <RiArrowUpLine className="h-[18px] w-[18px]" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-gray-400">
                AI answers can be inaccurate. Verify important information before using it in production systems.
              </p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)

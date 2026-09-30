'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs }) => {
  return (
    <div className="flex justify-end" key={id}>
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary-50 px-4 py-2.5 text-[15px] leading-relaxed text-gray-900 ring-1 ring-inset ring-primary-100">
        {imgSrcs && imgSrcs.length > 0 && (
          <ImageGallery srcs={imgSrcs} />
        )}
        <StreamdownMarkdown content={content} />
      </div>
    </div>
  )
}

export default React.memo(Question)

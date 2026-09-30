'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LogoMark } from '@/app/components/brand'

interface IAppUnavailableProps {
  isUnknownReason: boolean
  errMessage?: string
}

const AppUnavailable: FC<IAppUnavailableProps> = ({
  isUnknownReason,
  errMessage,
}) => {
  const { t } = useTranslation()
  let message = errMessage
  if (!errMessage) { message = (isUnknownReason ? t('app.common.appUnkonwError') : t('app.common.appUnavailable')) as string }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 bg-canvas px-6 text-center'>
      <LogoMark className='h-12 w-12' />
      <div className='text-4xl font-semibold text-gray-300'>{(errMessage || isUnknownReason) ? 500 : 404}</div>
      <div className='max-w-md text-sm text-gray-600'>{message}</div>
    </div>
  )
}
export default React.memo(AppUnavailable)

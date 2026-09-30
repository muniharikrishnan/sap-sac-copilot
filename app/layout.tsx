import type { Metadata, Viewport } from 'next'
import { getLocaleOnServer } from '@/i18n/server'
import { APP_INFO, THEME_STORAGE_KEY } from '@/config'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  title: APP_INFO.title,
  description: APP_INFO.description,
  applicationName: APP_INFO.title,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F6F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0C141D' },
  ],
}

// Runs before first paint so the page never flashes the wrong theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full font-sans">
        <div className="h-[100dvh] w-full min-w-[300px]">
          {children}
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout

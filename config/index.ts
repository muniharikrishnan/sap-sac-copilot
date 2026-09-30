import type { AppInfo } from '@/types/app'
// The Dify API key and URL live in config/server.ts so they never reach the browser.
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID || ''}`
export const APP_INFO: AppInfo = {
  title: 'SAP SAC Copilot',
  description: 'AI copilot for SAP Analytics Cloud, Datasphere and HANA',
  copyright: 'SAP SAC Copilot',
  privacy_policy: '',
  default_language: 'en',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

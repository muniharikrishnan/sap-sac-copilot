import 'server-only'

// Server-only secrets. Never import this file from a client component:
// anything a client component imports is bundled into the browser JS.
// APP_KEY is preferred; NEXT_PUBLIC_APP_KEY is still read for backward
// compatibility, but it is only safe because this module is server-only.
export const API_KEY = `${process.env.APP_KEY || process.env.NEXT_PUBLIC_APP_KEY || ''}`
export const API_URL = `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ''}`

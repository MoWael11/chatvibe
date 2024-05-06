import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Open_Sans } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { ScocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { SessionProvider } from '@/components/providers/session-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const viewPort: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    template: 'ChatVibe | %s',
    default: 'ChatVibe | Connect and Chat with Friends',
  },
  description:
    'ChatVibe is a messaging application that allows you to connect and chat with friends in real-time. Join the conversation!',
  verification: {
    google: 'FUyq9U6UIXphD70B5s1RKeaKUx5lO9lYXNz6vesAYb0',
  },
  manifest: '/manifest.json',
  generator: 'Next.js',
  applicationName: 'ChatVibe',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'ChatVibe',
    'Messaging App',
    'Chat with Friends',
    'Real-time Communication',
    'Connect with Friends',
    'Instant Messaging',
    'Chat',
  ],
  authors: [{ name: 'Mohamed', url: 'https://github.com/MoWael11' }],
  creator: 'Mohamed Wael',
  publisher: 'Mohamed Wael',
  category: 'Messaging',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
    other: {
      rel: 'icon-192x192.png',
      url: '/icons/icon-192x192.png',
    },
  },
  classification: 'Chat App',
  openGraph: {
    images: {
      url: '/images/main.png',
      type: 'image/png',
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='discord-theme'>
            <ScocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </ScocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}

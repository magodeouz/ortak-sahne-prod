import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Ortak Sahne',
  description: 'Ortak Sahne – Tiyatroların Ortak Sahnesi. Etkinlikler, oyunlar ve turneler.',
  generator: 'Ortak Sahne',
  keywords: ['Ortak Sahne', 'tiyatro', 'etkinlik', 'oyun', 'İstanbul tiyatro'],
  openGraph: {
    title: 'Ortak Sahne',
    description: 'Tiyatroların Ortak Sahnesi. Etkinlikler, oyunlar ve turneler.',
    url: 'https://ortaksahne.com',
    siteName: 'Ortak Sahne',
    images: [{ url: '/ortak-sahne-logo.jpg' }],
    type: 'website',
  },
  icons: {
    icon: '/ortak-sahne-logo.jpg',
    shortcut: '/ortak-sahne-logo.jpg',
    apple: '/ortak-sahne-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

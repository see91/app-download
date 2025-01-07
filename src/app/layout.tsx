import { Suspense } from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextUIProvider } from '@nextui-org/react'
import './globals.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Creamstream App Download',
  description: 'Creamstream App Download',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <NextUIProvider>{children}</NextUIProvider>
        </Suspense>
      </body>
    </html>
  )
}

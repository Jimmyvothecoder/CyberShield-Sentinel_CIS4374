import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyberShield Sentinel',
  description: 'Your all-in-one cybersecurity solution',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

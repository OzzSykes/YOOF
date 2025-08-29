import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yoof - Children&apos;s AI Education Centre',
  description: 'A Children&apos;s AI Education Centre, allowing children aged 6-11 to learn AI through the power of play along with art and craft activities.',
  keywords: 'AI education, children, learning, artificial intelligence, kids, interactive learning',
  authors: [{ name: 'Oliver' }],
  creator: 'Oliver',
  icons: {
    icon: '/yoof_1-removebg-preview.png',
    shortcut: '/yoof_1-removebg-preview.png',
    apple: '/yoof_1-removebg-preview.png',
  },
  openGraph: {
    title: 'Yoof - Children&apos;s AI Education Centre',
    description: 'Learn AI through play and creativity',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

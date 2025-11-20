import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthGuard } from '@/components/auth-guard'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Café Awsh Click Kandy',
  description: 'Café Awsh Click Kandy',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        // Use the single logo from the public folder
        url: '/logo.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthGuard>
          {children}
        </AuthGuard>
        <Analytics />
      </body>
    </html>
  )
}

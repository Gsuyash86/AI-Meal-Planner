import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'
import Providers from './providers'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI MealPro - Smart Nutrition Assistant',
  description: 'AI-powered meal planning with personalized nutrition recommendations. Track calories, discover recipes, and achieve your health goals.',
  keywords: ['meal planning', 'nutrition', 'AI', 'healthy eating', 'protein shakes', 'recipes'],
  authors: [{ name: 'AI MealPro Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <Providers>
          <ErrorBoundary>
            <Navigation />
            <main className="min-h-screen pt-24 md:pt-28 pb-16">
              {children}
            </main>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
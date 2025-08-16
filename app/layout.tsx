import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI MealPro - Smart Nutrition Assistant',
  description: 'AI-powered meal planning with personalized nutrition recommendations. Track calories, discover recipes, and achieve your health goals.',
  keywords: ['meal planning', 'nutrition', 'AI', 'healthy eating', 'protein shakes', 'recipes'],
  authors: [{ name: 'AI MealPro Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
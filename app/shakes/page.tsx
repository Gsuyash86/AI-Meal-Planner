import type { Metadata } from 'next'
import ProteinShakes from '@/app/components/ProteinShakes'

export const metadata: Metadata = {
  title: 'Protein Shakes | AI MealPro',
  description: 'Discover and track protein shake recipes tailored to your goals.'
}

export default function ShakesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ProteinShakes />
    </div>
  )
}

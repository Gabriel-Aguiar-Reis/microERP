import { HomePage } from '@/components/blocks/home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Tela Inicial'
}

export default function Home() {
  return <HomePage />
}

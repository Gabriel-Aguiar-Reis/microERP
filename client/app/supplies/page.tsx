import { Supplies } from '@/components/blocks/supplies'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Fornecimentos'
}

export default function Home() {
  return <Supplies />
}
